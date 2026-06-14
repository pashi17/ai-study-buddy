const express = require('express');
const router = express.Router();
const { uploadSyllabus, getSyllabuses } = require('../controllers/syllabusController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect);

// POST /api/syllabus/upload  — multipart/form-data with field "syllabus"
router.post('/upload', upload.single('syllabus'), uploadSyllabus);

// GET /api/syllabus
router.get('/', getSyllabuses);

module.exports = router;
