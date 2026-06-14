const Syllabus = require('../models/Syllabus');
const { extractTextFromFile, deleteFile } = require('../services/pdfService');
const { extractTopicsFromSyllabusAI } = require('../services/openaiService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * POST /api/syllabus/upload
 * Upload a syllabus (PDF or TXT), extract text, and parse topics via AI
 */
const uploadSyllabus = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload a PDF or TXT file', 400);
    }

    const { subject } = req.body;
    if (!subject) {
      deleteFile(req.file.path);
      return errorResponse(res, 'Subject name is required', 400);
    }

    // Extract text from file
    const rawText = await extractTextFromFile(req.file.path);

    if (!rawText || rawText.trim().length < 20) {
      deleteFile(req.file.path);
      return errorResponse(res, 'Could not extract readable text from the file', 422);
    }

    // Use AI to structure the topics
    const { topics, totalEstimatedHours } = await extractTopicsFromSyllabusAI({ rawText, subject });

    // Save to database
    const syllabus = await Syllabus.create({
      user: req.user._id,
      subject,
      originalFileName: req.file.originalname,
      rawText,
      topics,
      totalTopics: topics.length,
      totalEstimatedHours,
      isProcessed: true,
    });

    // Clean up uploaded file
    deleteFile(req.file.path);

    return successResponse(res, { syllabus }, 'Syllabus uploaded and processed successfully', 201);
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * GET /api/syllabus
 * Get all syllabuses for the authenticated user
 */
const getSyllabuses = async (req, res) => {
  try {
    const syllabuses = await Syllabus.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, { syllabuses, count: syllabuses.length }, 'Syllabuses fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { uploadSyllabus, getSyllabuses };
