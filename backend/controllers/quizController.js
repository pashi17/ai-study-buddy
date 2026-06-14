const { Quiz, QuizResult } = require('../models/Quiz');
const { WeakTopic } = require('../models/WeakTopic');
const { generateQuizAI, analyzeQuizPerformanceAI } = require('../services/openaiService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * POST /api/quiz/generate
 * Generate a new AI-powered quiz for a topic
 */
const generateQuiz = async (req, res) => {
  try {
    const { topic, subject, numQuestions = 5, difficulty = 'mixed' } = req.body;

    if (!topic) {
      return errorResponse(res, 'Topic is required', 400);
    }

    // Generate questions using OpenAI
    const { questions } = await generateQuizAI({ topic, subject, numQuestions, difficulty });

    if (!questions || questions.length === 0) {
      return errorResponse(res, 'Failed to generate quiz questions', 500);
    }

    const quiz = await Quiz.create({
      user: req.user._id,
      topic,
      subject,
      questions,
      totalQuestions: questions.length,
      difficulty,
    });

    // Return quiz WITHOUT correct answers (student shouldn't see them upfront)
    const quizForStudent = {
      _id: quiz._id,
      topic: quiz.topic,
      subject: quiz.subject,
      totalQuestions: quiz.totalQuestions,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q, i) => ({
        _id: q._id,
        index: i,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty,
        // correctAnswer and explanation are NOT sent here
      })),
    };

    return successResponse(res, { quiz: quizForStudent }, 'Quiz generated successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * POST /api/quiz/submit
 * Submit quiz answers, calculate score, store result, update weak topics
 */
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    // answers: [{ questionIndex: 0, selectedAnswer: 2 }, ...]

    if (!quizId || !answers || !Array.isArray(answers)) {
      return errorResponse(res, 'quizId and answers array are required', 400);
    }

    const quiz = await Quiz.findOne({ _id: quizId, user: req.user._id });
    if (!quiz) {
      return errorResponse(res, 'Quiz not found', 404);
    }

    if (quiz.isCompleted) {
      return errorResponse(res, 'This quiz has already been submitted', 400);
    }

    // Grade each answer
    let correctCount = 0;
    const gradedAnswers = [];
    const wrongQuestions = [];

    answers.forEach((ans) => {
      const question = quiz.questions[ans.questionIndex];
      if (!question) return;

      const isCorrect = ans.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;
      else wrongQuestions.push(question.question);

      gradedAnswers.push({
        questionIndex: ans.questionIndex,
        selectedAnswer: ans.selectedAnswer,
        isCorrect,
        timeTaken: ans.timeTaken || 0,
      });
    });

    const score = Math.round((correctCount / quiz.totalQuestions) * 100);

    // Get AI feedback
    const { feedback, isWeakTopic, severity } = await analyzeQuizPerformanceAI({
      topic: quiz.topic,
      score,
      totalQuestions: quiz.totalQuestions,
      wrongQuestions,
    });

    // Save quiz result
    const result = await QuizResult.create({
      user: req.user._id,
      quiz: quizId,
      topic: quiz.topic,
      answers: gradedAnswers,
      score,
      totalQuestions: quiz.totalQuestions,
      correctAnswers: correctCount,
      timeTaken: timeTaken || 0,
      feedback,
    });

    // Mark quiz as completed
    quiz.isCompleted = true;
    await quiz.save();

    // Update weak topics
    await updateWeakTopics(req.user._id, quiz.topic, quiz.subject, score, isWeakTopic, severity, result._id);

    // Return full answers with explanations now that quiz is submitted
    const answersWithExplanations = gradedAnswers.map((ans) => ({
      ...ans,
      correctAnswer: quiz.questions[ans.questionIndex].correctAnswer,
      explanation: quiz.questions[ans.questionIndex].explanation,
      question: quiz.questions[ans.questionIndex].question,
    }));

    return successResponse(res, {
      score,
      correctAnswers: correctCount,
      totalQuestions: quiz.totalQuestions,
      feedback,
      isWeakTopic,
      severity,
      answers: answersWithExplanations,
      resultId: result._id,
    }, 'Quiz submitted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Helper: Update or create WeakTopic entry after a quiz
 */
const updateWeakTopics = async (userId, topic, subject, score, isWeakTopic, severity, resultId) => {
  const existing = await WeakTopic.findOne({ user: userId, topic });

  if (existing) {
    existing.attempts += 1;
    existing.lastAttemptScore = score;
    existing.averageScore = Math.round(
      (existing.averageScore * (existing.attempts - 1) + score) / existing.attempts
    );
    existing.quizResults.push(resultId);

    // If consistently improving (avg > 70), mark as improved
    if (existing.averageScore >= 70 && existing.attempts >= 2) {
      existing.flaggedForRevision = false;
      existing.improvedAt = new Date();
    } else if (isWeakTopic) {
      existing.flaggedForRevision = true;
      existing.severity = severity;
    }

    await existing.save();
  } else if (isWeakTopic) {
    // Only create a new WeakTopic if AI flags it
    await WeakTopic.create({
      user: userId,
      topic,
      subject,
      attempts: 1,
      averageScore: score,
      lastAttemptScore: score,
      flaggedForRevision: true,
      severity,
      quizResults: [resultId],
    });
  }
};

/**
 * GET /api/quiz/history
 * Get quiz history for the authenticated user
 */
const getQuizHistory = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('quiz', 'topic subject difficulty');

    const stats = {
      totalQuizzes: results.length,
      averageScore: results.length
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0,
      bestScore: results.length ? Math.max(...results.map((r) => r.score)) : 0,
    };

    return successResponse(res, { results, stats }, 'Quiz history fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { generateQuiz, submitQuiz, getQuizHistory };
