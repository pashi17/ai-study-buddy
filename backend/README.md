# 🎓 AI Study Buddy — Backend API

A complete Node.js/Express backend for the AI Study Buddy EdTech platform. Powered by OpenAI GPT-4o-mini for intelligent study plans, quizzes, doubt solving, and revision roadmaps.

---

## 📁 Folder Structure

```
/backend
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Signup / Login
│   ├── userController.js      # Profile CRUD
│   ├── syllabusController.js  # Upload & parse syllabus
│   ├── studyPlanController.js # Generate & fetch study plan
│   ├── taskController.js      # Daily tasks & completion
│   ├── quizController.js      # Generate, submit, history
│   ├── chatController.js      # AI chatbot sessions
│   ├── weakTopicController.js # Weak topic tracking
│   └── roadmapController.js   # Revision roadmap
├── middlewares/
│   ├── authMiddleware.js      # JWT protect middleware
│   ├── uploadMiddleware.js    # Multer file upload config
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js
│   ├── Syllabus.js
│   ├── StudyPlan.js
│   ├── Quiz.js                # Quiz + QuizResult schemas
│   └── WeakTopic.js           # WeakTopic + ChatHistory schemas
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── syllabusRoutes.js
│   └── index.js               # All other routes
├── services/
│   ├── openaiService.js       # All OpenAI API calls
│   └── pdfService.js          # PDF/TXT text extraction
├── utils/
│   ├── generateToken.js       # JWT sign/verify
│   └── responseHelper.js      # Standardized responses
├── uploads/                   # Temp file storage (auto-cleaned)
├── .env.example
├── .gitignore
├── package.json
└── server.js                  # App entry point
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)

---

## 🚀 Getting Started

### 1. Clone / copy the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ai-study-buddy
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-your-key-here
MAX_FILE_SIZE=10485760
```

### 4. Run the server

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

Server starts at: **http://localhost:5000**
Health check: **http://localhost:5000/api/health**

---

## 🔐 Authentication

All protected routes require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned on signup and login.

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get token | ❌ |

**POST /api/auth/signup**
```json
// Request
{ "name": "Arjun Sharma", "email": "arjun@example.com", "password": "secret123" }

// Response 201
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "name": "Arjun Sharma", "email": "arjun@example.com" }
  }
}
```

**POST /api/auth/login**
```json
// Request
{ "email": "arjun@example.com", "password": "secret123" }

// Response 200
{ "success": true, "data": { "token": "eyJhbGci...", "user": { ... } } }
```

---

### User Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user/profile` | Get profile | ✅ |
| PUT | `/api/user/profile` | Update profile | ✅ |

**PUT /api/user/profile**
```json
// Request
{
  "name": "Arjun Sharma",
  "preferences": {
    "dailyStudyHours": 4,
    "examDate": "2025-06-15",
    "examName": "JEE Advanced",
    "subjects": ["Physics", "Chemistry", "Math"]
  }
}
```

---

### Syllabus

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/syllabus/upload` | Upload PDF/TXT syllabus | ✅ |
| GET | `/api/syllabus` | Get all syllabuses | ✅ |

**POST /api/syllabus/upload** — `multipart/form-data`
```
Field: syllabus  (file — PDF or TXT)
Field: subject   (text — e.g. "Physics")
```

```json
// Response 201
{
  "success": true,
  "data": {
    "syllabus": {
      "_id": "...",
      "subject": "Physics",
      "topics": [
        { "name": "Kinematics", "subtopics": ["Velocity", "Acceleration"], "estimatedHours": 3, "priority": "high" }
      ],
      "totalTopics": 12,
      "totalEstimatedHours": 40
    }
  }
}
```

---

### Study Plan

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/studyplan/generate` | Generate AI study plan | ✅ |
| GET | `/api/studyplan` | Get active study plan | ✅ |

**POST /api/studyplan/generate**
```json
// Request
{
  "syllabusId": "65abc123...",
  "examDate": "2025-06-15",
  "examName": "JEE Advanced",
  "dailyStudyHours": 5
}

// Response 201
{
  "success": true,
  "data": {
    "studyPlan": {
      "_id": "...",
      "totalDays": 45,
      "dailyPlans": [
        {
          "date": "2025-05-01",
          "dayNumber": 1,
          "topics": [
            { "_id": "...", "topicName": "Kinematics", "estimatedHours": 2.5, "isCompleted": false }
          ],
          "totalHours": 5,
          "completionPercentage": 0
        }
      ],
      "overallProgress": 0
    }
  }
}
```

---

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks/today` | Get today's tasks | ✅ |
| PUT | `/api/tasks/:id/complete` | Mark task complete | ✅ |

**GET /api/tasks/today** — Response:
```json
{
  "data": {
    "date": "2025-05-01",
    "dayNumber": 1,
    "tasks": [{ "_id": "topicId...", "topicName": "Kinematics", "isCompleted": false }],
    "completionPercentage": 0,
    "overallProgress": 0
  }
}
```

**PUT /api/tasks/:topicId/complete**
```json
// Response
{ "data": { "taskId": "...", "dayCompletionPercentage": 50, "overallProgress": 12 } }
```

---

### Quiz

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/quiz/generate` | Generate AI quiz | ✅ |
| POST | `/api/quiz/submit` | Submit answers | ✅ |
| GET | `/api/quiz/history` | Quiz history | ✅ |

**POST /api/quiz/generate**
```json
// Request
{ "topic": "Kinematics", "subject": "Physics", "numQuestions": 5, "difficulty": "mixed" }

// Response — correct answers are NOT included
{
  "data": {
    "quiz": {
      "_id": "quizId...",
      "questions": [
        {
          "_id": "q1...",
          "question": "A body moving with uniform acceleration...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "difficulty": "medium"
        }
      ]
    }
  }
}
```

**POST /api/quiz/submit**
```json
// Request
{
  "quizId": "quizId...",
  "answers": [
    { "questionIndex": 0, "selectedAnswer": 2 },
    { "questionIndex": 1, "selectedAnswer": 0 }
  ],
  "timeTaken": 240
}

// Response — now includes correct answers + explanations
{
  "data": {
    "score": 80,
    "correctAnswers": 4,
    "totalQuestions": 5,
    "feedback": "Great work on Kinematics! Review relative velocity concepts.",
    "isWeakTopic": false,
    "answers": [{ "questionIndex": 0, "isCorrect": true, "correctAnswer": 2, "explanation": "..." }]
  }
}
```

---

### AI Chatbot

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat/ask` | Ask a doubt | ✅ |
| GET | `/api/chat/sessions` | Get chat history | ✅ |
| GET | `/api/chat/sessions/:id` | Get session messages | ✅ |

**POST /api/chat/ask**
```json
// Request (new session)
{ "question": "What is Newton's second law?", "topic": "Laws of Motion" }

// Request (continue session)
{ "question": "Can you give an example?", "sessionId": "sessionId..." }

// Response
{
  "data": {
    "answer": "Newton's second law states that Force = mass × acceleration...",
    "sessionId": "sessionId...",
    "totalMessages": 2
  }
}
```

---

### Weak Topics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/weaktopics` | Get flagged weak topics | ✅ |
| GET | `/api/weaktopics/all` | All topic performance | ✅ |

```json
// GET /api/weaktopics response
{
  "data": {
    "weakTopics": [
      {
        "topic": "Electromagnetic Induction",
        "averageScore": 35,
        "attempts": 3,
        "severity": "critical",
        "flaggedForRevision": true
      }
    ],
    "count": 3,
    "breakdown": { "critical": 1, "moderate": 1, "mild": 1 }
  }
}
```

---

### Revision Roadmap

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/roadmap/generate` | Generate revision plan | ✅ |
| GET | `/api/roadmap` | Get roadmap (uses stored exam date) | ✅ |

**POST /api/roadmap/generate**
```json
// Request
{ "examDate": "2025-06-15", "dailyHours": 5 }

// Response
{
  "data": {
    "strategy": "Focus on critical weak topics first, then moderate ones...",
    "remainingDays": 14,
    "roadmap": [
      {
        "dayNumber": 1,
        "date": "2025-06-01",
        "focus": "Electromagnetic Induction — Deep Revision",
        "topics": ["Faraday's Law", "Lenz's Law"],
        "studyTips": "Solve 10 practice problems after each concept",
        "estimatedHours": 5
      }
    ]
  }
}
```

---

## 🛠️ Error Response Format

```json
{
  "success": false,
  "message": "Descriptive error message",
  "stack": "..." // Only in development mode
}
```

Common HTTP status codes:
- `400` Bad Request (missing/invalid fields)
- `401` Unauthorized (missing/expired token)
- `404` Not Found
- `409` Conflict (duplicate email)
- `413` File too large
- `422` Unprocessable (bad file content)
- `500` Server Error

---

## 🧪 Testing with cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"pass123"}'

# Upload syllabus
curl -X POST http://localhost:5000/api/syllabus/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "syllabus=@/path/to/syllabus.pdf" \
  -F "subject=Physics"
```

---

## 🔑 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret for signing JWTs | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `OPENAI_API_KEY` | OpenAI API key | — |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` |
| `CLIENT_URL` | CORS origin (frontend URL) | `*` |
