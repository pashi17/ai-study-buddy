const StudyPlan = require('../models/StudyPlan');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * GET /api/tasks/today
 * Get today's tasks from the active study plan
 */
const getTodayTasks = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({ user: req.user._id, isActive: true });
    if (!studyPlan) {
      return errorResponse(res, 'No active study plan found. Please generate one first.', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's plan entry
    const todayPlan = studyPlan.dailyPlans.find((day) => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate >= today && dayDate < tomorrow;
    });

    if (!todayPlan) {
      return successResponse(res, { tasks: [], message: 'No tasks scheduled for today' }, 'No tasks today');
    }

    // Calculate overall plan progress
    const totalTopics = studyPlan.dailyPlans.flatMap((d) => d.topics).length;
    const completedTopics = studyPlan.dailyPlans.flatMap((d) => d.topics).filter((t) => t.isCompleted).length;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return successResponse(res, {
      date: todayPlan.date,
      dayNumber: todayPlan.dayNumber,
      tasks: todayPlan.topics,
      totalHours: todayPlan.totalHours,
      completionPercentage: todayPlan.completionPercentage,
      isRestDay: todayPlan.isRestDay,
      overallProgress,
      planId: studyPlan._id,
      dayId: todayPlan._id,
    }, 'Today\'s tasks fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * PUT /api/tasks/:id/complete
 * Mark a specific task (topic) as completed
 * :id is the topic subdocument _id
 */
const completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const studyPlan = await StudyPlan.findOne({ user: req.user._id, isActive: true });
    if (!studyPlan) {
      return errorResponse(res, 'No active study plan found', 404);
    }

    // Find the task across all daily plans
    let taskFound = false;
    let dayPlan = null;

    for (const day of studyPlan.dailyPlans) {
      const task = day.topics.id(taskId);
      if (task) {
        task.isCompleted = true;
        task.completedAt = new Date();
        taskFound = true;
        dayPlan = day;

        // Update day completion percentage
        const completedInDay = day.topics.filter((t) => t.isCompleted).length;
        day.completionPercentage = Math.round((completedInDay / day.topics.length) * 100);
        break;
      }
    }

    if (!taskFound) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Recalculate overall progress
    const totalTopics = studyPlan.dailyPlans.flatMap((d) => d.topics).length;
    const completedTopics = studyPlan.dailyPlans.flatMap((d) => d.topics).filter((t) => t.isCompleted).length;
    studyPlan.overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    await studyPlan.save();

    return successResponse(res, {
      taskId,
      dayCompletionPercentage: dayPlan.completionPercentage,
      overallProgress: studyPlan.overallProgress,
    }, 'Task marked as completed');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { getTodayTasks, completeTask };
