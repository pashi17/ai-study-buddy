const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 options
  correctAnswer: { type: Number, required: true }, // index 0-3
  explanation: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
});

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    subject: { type: String },
    questions: [questionSchema],
    totalQuestions: { type: Number, default: 5 },
    timeLimit: { type: Number, default: 10 }, // minutes
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'mixed'], default: 'mixed' },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    topic: { type: String, required: true },
    answers: [
      {
        questionIndex: { type: Number },
        selectedAnswer: { type: Number }, // index chosen
        isCorrect: { type: Boolean },
        timeTaken: { type: Number }, // seconds
      },
    ],
    score: { type: Number, required: true }, // out of 100
    totalQuestions: { type: Number },
    correctAnswers: { type: Number },
    timeTaken: { type: Number }, // total seconds
    feedback: { type: String }, // AI generated feedback
  },
  { timestamps: true }
);

module.exports = {
  Quiz: mongoose.model('Quiz', quizSchema),
  QuizResult: mongoose.model('QuizResult', quizResultSchema),
};
