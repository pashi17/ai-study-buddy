const { WeakTopic } = require('../models/WeakTopic');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * GET /api/weaktopics
 * Get all flagged weak topics for the authenticated user
 */
const getWeakTopics = async (req, res) => {
  try {
    const weakTopics = await WeakTopic.find({
      user: req.user._id,
      flaggedForRevision: true,
    }).sort({ averageScore: 1 }); // Worst scores first

    // Categorize by severity
    const critical = weakTopics.filter((t) => t.severity === 'critical');
    const moderate = weakTopics.filter((t) => t.severity === 'moderate');
    const mild = weakTopics.filter((t) => t.severity === 'mild');

    return successResponse(res, {
      weakTopics,
      count: weakTopics.length,
      breakdown: {
        critical: critical.length,
        moderate: moderate.length,
        mild: mild.length,
      },
    }, 'Weak topics fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * GET /api/weaktopics/all
 * Get all topics with performance data (including improved ones)
 */
const getAllTopicPerformance = async (req, res) => {
  try {
    const topics = await WeakTopic.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return successResponse(res, { topics, count: topics.length }, 'Topic performance fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { getWeakTopics, getAllTopicPerformance };
