const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * GET /api/user/profile
 * Get the authenticated user's profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, { user }, 'Profile fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * PUT /api/user/profile
 * Update profile and study preferences
 */
const updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;

    // Build update object — only include provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (preferences) {
      if (preferences.dailyStudyHours) updateData['preferences.dailyStudyHours'] = preferences.dailyStudyHours;
      if (preferences.examDate) updateData['preferences.examDate'] = new Date(preferences.examDate);
      if (preferences.examName) updateData['preferences.examName'] = preferences.examName;
      if (preferences.subjects) updateData['preferences.subjects'] = preferences.subjects;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true, runValidators: true });

    return successResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { getProfile, updateProfile };
