const { ChatHistory } = require('../models/WeakTopic');
const { answerDoubtAI } = require('../services/openaiService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * POST /api/chat/ask
 * Send a message to the AI study buddy chatbot
 * Supports conversation history for context
 */
const askQuestion = async (req, res) => {
  try {
    const { question, sessionId, topic } = req.body;

    if (!question || question.trim().length === 0) {
      return errorResponse(res, 'Question cannot be empty', 400);
    }

    let chatSession;

    // Resume existing session or create a new one
    if (sessionId) {
      chatSession = await ChatHistory.findOne({ _id: sessionId, user: req.user._id });
    }

    if (!chatSession) {
      chatSession = await ChatHistory.create({
        user: req.user._id,
        sessionTitle: question.substring(0, 50),
        topic: topic || '',
        messages: [],
        totalMessages: 0,
      });
    }

    // Build conversation history for OpenAI context (last 10 messages)
    const conversationHistory = chatSession.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Get AI answer
    const answer = await answerDoubtAI({
      question,
      conversationHistory,
      topic: topic || chatSession.topic,
    });

    // Append messages to session
    chatSession.messages.push({ role: 'user', content: question });
    chatSession.messages.push({ role: 'assistant', content: answer });
    chatSession.totalMessages = chatSession.messages.length;

    await chatSession.save();

    return successResponse(res, {
      answer,
      sessionId: chatSession._id,
      totalMessages: chatSession.totalMessages,
    }, 'Answer generated');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * GET /api/chat/sessions
 * Get all chat sessions for the user
 */
const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatHistory.find({ user: req.user._id })
      .select('sessionTitle topic totalMessages createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    return successResponse(res, { sessions }, 'Chat sessions fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * GET /api/chat/sessions/:id
 * Get full message history for a session
 */
const getSessionMessages = async (req, res) => {
  try {
    const session = await ChatHistory.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return errorResponse(res, 'Chat session not found', 404);
    }
    return successResponse(res, { session }, 'Session messages fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { askQuestion, getChatSessions, getSessionMessages };
