const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = process.env.OPENAI_MODEL || 'meta/llama-3.1-8b-instruct';

const parseJSON = (text, context) => {
  const clean = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error(`[AI JSON parse error in ${context}]`, clean.substring(0, 300));
    throw new Error('AI returned an unexpected response format. Please try again.');
  }
};

const askAI = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
  });
  return response.choices[0].message.content;
};

const askAIText = async (messages) => {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });
  return response.choices[0].message.content;
};

const generateStudyPlanAI = async ({ topics, examDate, dailyStudyHours, examName }) => {
  const daysUntilExam = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
  const topicList = topics.map((t) => `- ${t.name} (~${t.estimatedHours}h)`).join('\n');
  const prompt = `You are an expert academic planner. Create a day-wise study plan for a student.
Exam: ${examName || 'Upcoming Exam'}
Days until exam: ${daysUntilExam}
Daily study hours available: ${dailyStudyHours}
Topics to cover:
${topicList}
Rules: Distribute topics optimally, include revision days last 2-3 days, don't overload any day.
Respond ONLY with valid JSON no extra text no markdown backticks:
{"totalDays":number,"plan":[{"dayNumber":1,"date":"YYYY-MM-DD","topics":[{"topicName":"string","estimatedHours":number,"subtopics":["string"],"isRevision":false}],"totalHours":number,"isRestDay":false,"notes":"string"}]}`;
  return parseJSON(await askAI(prompt), 'generateStudyPlanAI');
};

const generateQuizAI = async ({ topic, subject, numQuestions = 5, difficulty = 'mixed' }) => {
  const prompt = `Generate ${numQuestions} multiple-choice quiz questions about "${topic}" ${subject ? `(Subject: ${subject})` : ''}.
Difficulty: ${difficulty}
Respond ONLY with valid JSON no extra text no markdown backticks:
{"questions":[{"question":"string","options":["A","B","C","D"],"correctAnswer":0,"explanation":"string","difficulty":"medium"}]}
correctAnswer is 0-based index of correct option.`;
  return parseJSON(await askAI(prompt), 'generateQuizAI');
};

const analyzeQuizPerformanceAI = async ({ topic, score, totalQuestions, wrongQuestions }) => {
  const prompt = `Student scored ${score}% on "${topic}" quiz (${totalQuestions} questions).
Wrong: ${wrongQuestions.join('; ')}
Give 2-3 sentence encouraging feedback. Respond ONLY with valid JSON no markdown:
{"feedback":"string","isWeakTopic":boolean,"severity":"moderate"}
severity must be one of: critical, moderate, mild`;
  return parseJSON(await askAI(prompt), 'analyzeQuizPerformanceAI');
};

const answerDoubtAI = async ({ question, conversationHistory = [], topic = '' }) => {
  const messages = [
    {
      role: 'system',
      content: `You are a friendly AI Study Buddy. ${topic ? `Student is studying: ${topic}.` : ''} Explain simply with examples. Be encouraging and concise.`,
    },
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: question },
  ];
  return await askAIText(messages);
};

const generateRevisionRoadmapAI = async ({ weakTopics, examDate, remainingDays, dailyHours }) => {
  const weakList = weakTopics.map((t) => `- ${t.topic} (score: ${t.averageScore}%)`).join('\n');
  const prompt = `Generate focused revision roadmap. ${remainingDays} days left. ${dailyHours}h/day.
Weak topics: ${weakList}
Respond ONLY with valid JSON no markdown:
{"roadmap":[{"dayNumber":1,"date":"YYYY-MM-DD","focus":"string","topics":["string"],"studyTips":"string","estimatedHours":number}],"strategy":"string"}`;
  return parseJSON(await askAI(prompt), 'generateRevisionRoadmapAI');
};

const extractTopicsFromSyllabusAI = async ({ rawText, subject }) => {
  if (rawText.length > 4000) {
    console.warn(`[Syllabus] Text truncated from ${rawText.length} to 4000 chars for subject: ${subject}`);
  }
  const prompt = `Extract study topics from this syllabus for "${subject}".
Text: ${rawText.substring(0, 4000)}
Respond ONLY with valid JSON no markdown:
{"topics":[{"name":"string","subtopics":["string"],"estimatedHours":number,"priority":"high"}],"totalEstimatedHours":number}
priority must be one of: high, medium, low`;
  return parseJSON(await askAI(prompt), 'extractTopicsFromSyllabusAI');
};

module.exports = {
  generateStudyPlanAI,
  generateQuizAI,
  analyzeQuizPerformanceAI,
  answerDoubtAI,
  generateRevisionRoadmapAI,
  extractTopicsFromSyllabusAI,
};