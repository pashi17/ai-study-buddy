const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

// ── Study Plan ────────────────────────────────────────────────────────────────
const studyPlanRouter = express.Router();
const { generateStudyPlan, getStudyPlan } = require('../controllers/studyPlanController');

studyPlanRouter.use(protect);
studyPlanRouter.post('/generate', generateStudyPlan);   // POST /api/studyplan/generate
studyPlanRouter.get('/', getStudyPlan);                 // GET  /api/studyplan

// ── Tasks ─────────────────────────────────────────────────────────────────────
const taskRouter = express.Router();
const { getTodayTasks, completeTask } = require('../controllers/taskController');

taskRouter.use(protect);
taskRouter.get('/today', getTodayTasks);                // GET /api/tasks/today
taskRouter.put('/:id/complete', completeTask);          // PUT /api/tasks/:id/complete

// ── Quiz ──────────────────────────────────────────────────────────────────────
const quizRouter = express.Router();
const { generateQuiz, submitQuiz, getQuizHistory } = require('../controllers/quizController');

quizRouter.use(protect);
quizRouter.post('/generate', generateQuiz);             // POST /api/quiz/generate
quizRouter.post('/submit', submitQuiz);                 // POST /api/quiz/submit
quizRouter.get('/history', getQuizHistory);             // GET  /api/quiz/history

// ── Chat ──────────────────────────────────────────────────────────────────────
const chatRouter = express.Router();
const { askQuestion, getChatSessions, getSessionMessages } = require('../controllers/chatController');

chatRouter.use(protect);
chatRouter.post('/ask', askQuestion);                   // POST /api/chat/ask
chatRouter.get('/sessions', getChatSessions);           // GET  /api/chat/sessions
chatRouter.get('/sessions/:id', getSessionMessages);    // GET  /api/chat/sessions/:id

// ── Weak Topics ───────────────────────────────────────────────────────────────
const weakTopicRouter = express.Router();
const { getWeakTopics, getAllTopicPerformance } = require('../controllers/weakTopicController');

weakTopicRouter.use(protect);
weakTopicRouter.get('/', getWeakTopics);                // GET /api/weaktopics
weakTopicRouter.get('/all', getAllTopicPerformance);     // GET /api/weaktopics/all

// ── Roadmap ───────────────────────────────────────────────────────────────────
const roadmapRouter = express.Router();
const { generateRoadmap, getRoadmap } = require('../controllers/roadmapController');

roadmapRouter.use(protect);
roadmapRouter.post('/generate', generateRoadmap);       // POST /api/roadmap/generate
roadmapRouter.get('/', getRoadmap);                     // GET  /api/roadmap

module.exports = { studyPlanRouter, taskRouter, quizRouter, chatRouter, weakTopicRouter, roadmapRouter };
