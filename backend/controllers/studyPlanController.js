const StudyPlan = require('../models/StudyPlan');
const Syllabus = require('../models/Syllabus');
const { generateStudyPlanAI } = require('../services/openaiService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * POST /api/studyplan/generate
 * Generate an AI study plan from a syllabus
 */
const generateStudyPlan = async (req, res) => {
  try {
    const { syllabusId, examDate, examName, dailyStudyHours } = req.body;

    if (!syllabusId || !examDate || !dailyStudyHours) {
      return errorResponse(res, 'syllabusId, examDate, and dailyStudyHours are required', 400);
    }

    const examDateObj = new Date(examDate);
    if (examDateObj <= new Date()) {
      return errorResponse(res, 'Exam date must be in the future', 400);
    }

    // Fetch the syllabus
    const syllabus = await Syllabus.findOne({ _id: syllabusId, user: req.user._id });
    if (!syllabus) {
      return errorResponse(res, 'Syllabus not found', 404);
    }

    // Generate plan using AI
    const aiPlan = await generateStudyPlanAI({
      topics: syllabus.topics,
      examDate: examDateObj,
      dailyStudyHours,
      examName: examName || syllabus.subject,
    });

    // Build daily plan entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyPlans = aiPlan.plan.map((day) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + day.dayNumber - 1);

      return {
        date: dayDate,
        dayNumber: day.dayNumber,
        topics: day.topics.map((t) => ({
          topicName: t.topicName,
          subtopics: t.subtopics || [],
          estimatedHours: t.estimatedHours || 1,
          subject: syllabus.subject,
          isCompleted: false,
        })),
        totalHours: day.totalHours || dailyStudyHours,
        isRestDay: day.isRestDay || false,
        completionPercentage: 0,
      };
    });

    // Deactivate any existing active plan
    await StudyPlan.updateMany({ user: req.user._id, isActive: true }, { isActive: false });

    const studyPlan = await StudyPlan.create({
      user: req.user._id,
      syllabus: syllabusId,
      examDate: examDateObj,
      examName: examName || syllabus.subject,
      dailyStudyHours,
      totalDays: aiPlan.totalDays,
      dailyPlans,
      isActive: true,
    });

    return successResponse(res, { studyPlan }, 'Study plan generated successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * GET /api/studyplan
 * Fetch the active study plan for the user
 */
const getStudyPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({ user: req.user._id, isActive: true })
      .populate('syllabus', 'subject totalTopics');

    if (!studyPlan) {
      return errorResponse(res, 'No active study plan found', 404);
    }

    return successResponse(res, { studyPlan }, 'Study plan fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { generateStudyPlan, getStudyPlan };
