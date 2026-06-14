const { WeakTopic } = require('../models/WeakTopic');
const StudyPlan = require('../models/StudyPlan');
const { generateRevisionRoadmapAI } = require('../services/openaiService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * POST /api/roadmap/generate
 * Generate a pre-exam revision roadmap prioritizing weak topics
 */
const generateRoadmap = async (req, res) => {
  try {
    const { examDate, dailyHours } = req.body;

    // Use exam date from request or fall back to active study plan
    let resolvedExamDate = examDate;
    let resolvedDailyHours = dailyHours;

    if (!resolvedExamDate) {
      const activePlan = await StudyPlan.findOne({ user: req.user._id, isActive: true });
      if (activePlan) {
        resolvedExamDate = activePlan.examDate;
        resolvedDailyHours = resolvedDailyHours || activePlan.dailyStudyHours;
      }
    }

    if (!resolvedExamDate) {
      return errorResponse(res, 'Exam date is required (or set it in your active study plan)', 400);
    }

    const examDateObj = new Date(resolvedExamDate);
    const remainingDays = Math.max(
      1,
      Math.ceil((examDateObj - new Date()) / (1000 * 60 * 60 * 24))
    );

    // Fetch weak topics flagged for revision
    const weakTopics = await WeakTopic.find({
      user: req.user._id,
      flaggedForRevision: true,
    }).sort({ averageScore: 1 });

    if (weakTopics.length === 0) {
      return successResponse(res, {
        message: 'Great news! No weak topics detected. Focus on full revision.',
        roadmap: [],
        strategy: 'You have no critical weak topics. Review all topics equally in the remaining days.',
        remainingDays,
      }, 'No weak topics found');
    }

    const roadmapData = await generateRevisionRoadmapAI({
      weakTopics,
      examDate: examDateObj,
      remainingDays,
      dailyHours: resolvedDailyHours || 3,
    });

    return successResponse(res, {
      ...roadmapData,
      remainingDays,
      examDate: examDateObj,
      weakTopicsCount: weakTopics.length,
    }, 'Revision roadmap generated');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * GET /api/roadmap
 * Alias — generate roadmap using stored preferences
 */
const getRoadmap = async (req, res) => {
  req.body = req.body || {};
  return generateRoadmap(req, res);
};

module.exports = { generateRoadmap, getRoadmap };
