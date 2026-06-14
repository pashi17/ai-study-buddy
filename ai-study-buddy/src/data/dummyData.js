// ─── User ─────────────────────────────────────────────
export const currentUser = {
  name: 'Enter name',
  email: 'Enter email',
  avatar: 'PS',
  streak: 12,
  level: 'Advanced',
  totalPoints: 2840,
  joinDate: 'Jan 2025',
}

// ─── Stats ────────────────────────────────────────────
export const stats = [
  { label: 'Topics Covered', value: '42', change: '+6', positive: true, icon: 'BookOpen' },
  { label: 'Quiz Score Avg', value: '78%', change: '+3%', positive: true, icon: 'Target' },
  { label: 'Study Hours', value: '94h', change: '+8h', positive: true, icon: 'Clock' },
  { label: 'Weak Topics', value: '5', change: '-2', positive: true, icon: 'AlertTriangle' },
]

// ─── Today's Tasks ────────────────────────────────────
export const todayTasks = [
  { id: 1, title: 'Data Structures – Trees & Graphs', subject: 'CS', duration: '45 min', done: true, priority: 'high' },
  { id: 2, title: 'Operating Systems – Memory Mgmt', subject: 'CS', duration: '30 min', done: true, priority: 'medium' },
  { id: 3, title: 'Calculus – Differential Equations', subject: 'Math', duration: '40 min', done: false, priority: 'high' },
  { id: 4, title: 'Database Normalization (1NF–3NF)', subject: 'CS', duration: '25 min', done: false, priority: 'low' },
  { id: 5, title: 'CN – TCP/IP & Subnetting', subject: 'CS', duration: '35 min', done: false, priority: 'medium' },
]

// ─── Study Plan ───────────────────────────────────────
export const studyPlanWeek = [
  {
    day: 'Monday',
    date: 'Mar 10',
    tasks: [
      { id: 1, topic: 'Binary Search Trees', subject: 'Data Structures', duration: 45, done: true },
      { id: 2, topic: 'Paging & Segmentation', subject: 'OS', duration: 30, done: true },
      { id: 3, topic: 'SQL Joins & Subqueries', subject: 'DBMS', duration: 35, done: false },
    ],
  },
  {
    day: 'Tuesday',
    date: 'Mar 11',
    tasks: [
      { id: 4, topic: 'Graph Algorithms (BFS/DFS)', subject: 'Data Structures', duration: 50, done: false },
      { id: 5, topic: 'Process Scheduling', subject: 'OS', duration: 40, done: false },
    ],
  },
  {
    day: 'Wednesday',
    date: 'Mar 12',
    tasks: [
      { id: 6, topic: 'Dynamic Programming Basics', subject: 'Algorithms', duration: 60, done: false },
      { id: 7, topic: 'Normalization & ER Diagrams', subject: 'DBMS', duration: 30, done: false },
      { id: 8, topic: 'OSI vs TCP/IP Model', subject: 'CN', duration: 25, done: false },
    ],
  },
  {
    day: 'Thursday',
    date: 'Mar 13',
    tasks: [
      { id: 9, topic: 'Sorting Algorithms Review', subject: 'Algorithms', duration: 45, done: false },
      { id: 10, topic: 'Deadlocks & Synchronization', subject: 'OS', duration: 35, done: false },
    ],
  },
  {
    day: 'Friday',
    date: 'Mar 14',
    tasks: [
      { id: 11, topic: 'IP Addressing & Subnetting', subject: 'CN', duration: 40, done: false },
      { id: 12, topic: 'Greedy Algorithms', subject: 'Algorithms', duration: 45, done: false },
    ],
  },
]

// ─── Quiz Questions ───────────────────────────────────
export const quizQuestions = [
  {
    id: 1,
    subject: 'Data Structures',
    difficulty: 'Medium',
    question: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correct: 1,
    explanation: 'In a balanced BST, each comparison eliminates half the remaining nodes, giving O(log n) time complexity.',
  },
  {
    id: 2,
    subject: 'Operating Systems',
    difficulty: 'Hard',
    question: 'Which scheduling algorithm minimizes average waiting time in a non-preemptive system?',
    options: ['FCFS', 'Round Robin', 'SJF', 'Priority Scheduling'],
    correct: 2,
    explanation: 'Shortest Job First (SJF) minimizes average waiting time by always executing the process with the least burst time.',
  },
  {
    id: 3,
    subject: 'DBMS',
    difficulty: 'Easy',
    question: 'Which normal form eliminates partial dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correct: 1,
    explanation: '2NF eliminates partial dependencies by ensuring all non-key attributes depend on the entire primary key.',
  },
  {
    id: 4,
    subject: 'Computer Networks',
    difficulty: 'Medium',
    question: 'What is the maximum number of hosts in a /26 subnet?',
    options: ['30', '62', '126', '14'],
    correct: 1,
    explanation: 'A /26 subnet has 6 host bits. 2^6 - 2 = 62 usable host addresses.',
  },
  {
    id: 5,
    subject: 'Algorithms',
    difficulty: 'Hard',
    question: "Which technique does Dijkstra's algorithm use?",
    options: ['Dynamic Programming', 'Greedy', 'Divide & Conquer', 'Backtracking'],
    correct: 1,
    explanation: "Dijkstra's uses a greedy approach — always picking the unvisited node with the smallest tentative distance.",
  },
]

// ─── Weak Topics ──────────────────────────────────────
export const weakTopics = [
  {
    id: 1,
    subject: 'Algorithms',
    topic: 'Dynamic Programming',
    score: 32,
    attempts: 5,
    lastAttempt: '2 days ago',
    tags: ['Hard', 'Frequently Asked'],
    recommended: ['Fibonacci DP', 'Knapsack Problem', 'Longest Common Subsequence'],
  },
  {
    id: 2,
    subject: 'Computer Networks',
    topic: 'IP Subnetting',
    score: 45,
    attempts: 4,
    lastAttempt: '1 day ago',
    tags: ['Medium', 'Practical'],
    recommended: ['CIDR Notation', 'Variable Length Subnetting', 'Route Aggregation'],
  },
  {
    id: 3,
    subject: 'Operating Systems',
    topic: 'Deadlock Avoidance',
    score: 50,
    attempts: 3,
    lastAttempt: '3 days ago',
    tags: ['Hard', 'Theory'],
    recommended: ["Banker's Algorithm", 'Resource Allocation Graph', 'Detection Methods'],
  },
  {
    id: 4,
    subject: 'DBMS',
    topic: 'Query Optimization',
    score: 55,
    attempts: 2,
    lastAttempt: '5 days ago',
    tags: ['Medium'],
    recommended: ['Index Structures', 'Query Cost Estimation', 'Join Ordering'],
  },
  {
    id: 5,
    subject: 'Math',
    topic: 'Differential Equations',
    score: 38,
    attempts: 6,
    lastAttempt: 'Today',
    tags: ['Hard', 'Calculation-Heavy'],
    recommended: ['First Order ODEs', 'Homogeneous Equations', 'Laplace Transform'],
  },
]

// ─── Revision Roadmap ─────────────────────────────────
export const revisionRoadmap = [
  {
    week: 'Week 1',
    dates: 'Mar 10–16',
    focus: 'Foundation Review',
    status: 'current',
    topics: [
      { id: 1, name: 'Arrays & Linked Lists', subject: 'DSA', done: true, priority: 'high' },
      { id: 2, name: 'Stacks & Queues', subject: 'DSA', done: true, priority: 'medium' },
      { id: 3, name: 'Basic Sorting', subject: 'Algorithms', done: false, priority: 'high' },
      { id: 4, name: 'Relational Model', subject: 'DBMS', done: false, priority: 'medium' },
    ],
  },
  {
    week: 'Week 2',
    dates: 'Mar 17–23',
    focus: 'Intermediate Concepts',
    status: 'upcoming',
    topics: [
      { id: 5, name: 'Trees & Graphs', subject: 'DSA', done: false, priority: 'high' },
      { id: 6, name: 'Dynamic Programming', subject: 'Algorithms', done: false, priority: 'high' },
      { id: 7, name: 'SQL Advanced', subject: 'DBMS', done: false, priority: 'medium' },
      { id: 8, name: 'Process Management', subject: 'OS', done: false, priority: 'medium' },
    ],
  },
  {
    week: 'Week 3',
    dates: 'Mar 24–30',
    focus: 'Deep Dives',
    status: 'upcoming',
    topics: [
      { id: 9, name: 'Network Protocols', subject: 'CN', done: false, priority: 'high' },
      { id: 10, name: 'Memory Management', subject: 'OS', done: false, priority: 'high' },
      { id: 11, name: 'Transaction & Concurrency', subject: 'DBMS', done: false, priority: 'medium' },
    ],
  },
  {
    week: 'Week 4',
    dates: 'Mar 31–Apr 6',
    focus: 'Mock Tests & Revision',
    status: 'upcoming',
    topics: [
      { id: 12, name: 'Full Mock Test 1', subject: 'All', done: false, priority: 'high' },
      { id: 13, name: 'Weak Topic Revision', subject: 'All', done: false, priority: 'high' },
      { id: 14, name: 'Full Mock Test 2', subject: 'All', done: false, priority: 'high' },
    ],
  },
]

// ─── Testimonials ─────────────────────────────────────
export const testimonials = [
  {
    name: 'Riya Kapoor',
    role: 'B.Tech CSE, Year 3',
    avatar: 'RK',
    text: 'AI Study Buddy completely transformed my exam prep. The personalized study plans save me so much time and the quiz mode is addictive!',
    rating: 5,
    improvement: '+24% score improvement',
  },
  {
    name: 'Arjun Mehta',
    role: 'GATE 2025 Aspirant',
    avatar: 'AM',
    text: 'The weak topic tracker is genius. It caught patterns in my mistakes that I never noticed myself. My GATE rank jumped from 800 to 180!',
    rating: 5,
    improvement: 'GATE Rank: 800 → 180',
  },
  {
    name: 'Sneha Reddy',
    role: 'MCA Student',
    avatar: 'SR',
    text: 'The AI doubt chat is like having a tutor available 24/7. I ask questions at midnight and get perfect explanations instantly.',
    rating: 5,
    improvement: '3x faster learning',
  },
]

// ─── Chat messages seed ───────────────────────────────
export const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: "Hello! I'm your AI Study Buddy 🎓 I'm here to help you understand any topic, clarify doubts, and guide your learning. What would you like to explore today?",
    time: '10:00 AM',
  },
]

// ─── Features ─────────────────────────────────────────
export const features = [
  {
    icon: 'Upload',
    title: 'Syllabus Upload',
    desc: 'Upload any PDF syllabus and let the AI parse, categorize, and plan your entire preparation in seconds.',
    color: 'blue',
  },
  {
    icon: 'Calendar',
    title: 'Smart Study Plans',
    desc: 'AI-generated daily plans adapt to your pace, available time, and upcoming exam dates.',
    color: 'purple',
  },
  {
    icon: 'Brain',
    title: 'Daily Micro-Quizzes',
    desc: 'Targeted quizzes on exactly what you studied — with smart difficulty scaling.',
    color: 'teal',
  },
  {
    icon: 'MessageCircle',
    title: 'AI Doubt Solver',
    desc: '24/7 AI tutor that explains any concept in multiple ways until you truly understand.',
    color: 'amber',
  },
  {
    icon: 'AlertTriangle',
    title: 'Weak Topic Radar',
    desc: 'Automatically identifies patterns in your errors and prioritizes revision accordingly.',
    color: 'coral',
  },
  {
    icon: 'Map',
    title: 'Revision Roadmap',
    desc: 'Visual timeline of your entire preparation with priority tags and completion tracking.',
    color: 'green',
  },
]
