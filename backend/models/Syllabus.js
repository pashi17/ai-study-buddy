const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtopics: [{ type: String }],
  estimatedHours: { type: Number, default: 1 },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  completed: { type: Boolean, default: false },
});

const syllabusSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    originalFileName: { type: String },
    rawText: { type: String }, // Extracted text from PDF
    topics: [topicSchema],
    totalTopics: { type: Number, default: 0 },
    totalEstimatedHours: { type: Number, default: 0 },
    isProcessed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Syllabus', syllabusSchema);
