const mongoose = require('mongoose');

const dailyPlanSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayNumber: { type: Number, required: true },
  topics: [
    {
      topicName: { type: String, required: true },
      subtopics: [{ type: String }],
      estimatedHours: { type: Number, default: 1 },
      subject: { type: String },
      isCompleted: { type: Boolean, default: false },
      completedAt: { type: Date },
    },
  ],
  totalHours: { type: Number, default: 0 },
  isRestDay: { type: Boolean, default: false },
  completionPercentage: { type: Number, default: 0 },
});

const studyPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    syllabus: { type: mongoose.Schema.Types.ObjectId, ref: 'Syllabus' },
    examDate: { type: Date, required: true },
    examName: { type: String },
    dailyStudyHours: { type: Number, required: true },
    totalDays: { type: Number },
    dailyPlans: [dailyPlanSchema],
    overallProgress: { type: Number, default: 0 }, // 0-100
    isActive: { type: Boolean, default: true },
    generatedBy: { type: String, default: 'ai' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
