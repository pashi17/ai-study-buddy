const mongoose = require('mongoose');

// ── WeakTopic ─────────────────────────────────────────────────────────────────
const weakTopicSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    subject: { type: String },
    attempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }, // 0-100
    lastAttemptScore: { type: Number },
    flaggedForRevision: { type: Boolean, default: true },
    severity: { type: String, enum: ['critical', 'moderate', 'mild'], default: 'moderate' },
    improvedAt: { type: Date }, // set when score consistently > 70
    quizResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizResult' }],
  },
  { timestamps: true }
);

// ── ChatHistory ────────────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionTitle: { type: String, default: 'Study Session' },
    messages: [messageSchema],
    topic: { type: String }, // optional topic context
    totalMessages: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = {
  WeakTopic: mongoose.model('WeakTopic', weakTopicSchema),
  ChatHistory: mongoose.model('ChatHistory', chatHistorySchema),
};
