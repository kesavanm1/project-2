import { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {
  Activity,
  CalendarDays,
  Bell,
  BookMarked,
  BookOpen,
  Brain,
  CheckCircle2,
  Check,
  Clock3,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  Moon,
  NotebookPen,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
  TimerReset,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './App.css';

const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'General Knowledge',
  'English',
  'Logical Reasoning',
];

const defaultQuestions = [
  {
    id: 'Q-1001',
    questionText: 'A car travels 100 metres in 5 seconds. What is its average speed?',
    type: 'Single Correct MCQ',
    subject: 'Physics',
    topic: 'Motion',
    difficulty: 'Easy',
    options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'],
    correctAnswer: '20 m/s',
    explanation: 'Average speed = Distance / Time = 100 / 5 = 20 m/s.',
    positiveMarks: 4,
    negativeMarks: 1,
    tags: ['motion', 'speed'],
  },
  {
    id: 'Q-1002',
    questionText: 'If x + 3 = 10, what is x?',
    type: 'Single Correct MCQ',
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'Easy',
    options: ['5', '6', '7', '8'],
    correctAnswer: '7',
    explanation: 'Subtract 3 from both sides: x = 10 - 3 = 7.',
    positiveMarks: 4,
    negativeMarks: 1,
    tags: ['algebra', 'equation'],
  },
  {
    id: 'Q-1003',
    questionText: 'Which of the following is a prime number?',
    type: 'Single Correct MCQ',
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'Medium',
    options: ['15', '21', '29', '33'],
    correctAnswer: '29',
    explanation: '29 is divisible only by 1 and itself.',
    positiveMarks: 4,
    negativeMarks: 1,
    tags: ['number theory', 'prime'],
  },
  {
    id: 'Q-1004',
    questionText: 'Which gas is most abundant in Earth’s atmosphere?',
    type: 'Single Correct MCQ',
    subject: 'Chemistry',
    topic: 'Inorganic Chemistry',
    difficulty: 'Medium',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correctAnswer: 'Nitrogen',
    explanation: 'Nitrogen makes up about 78% of Earth’s atmosphere.',
    positiveMarks: 4,
    negativeMarks: 1,
    tags: ['atmosphere', 'gas'],
  },
  {
    id: 'Q-1005',
    questionText: 'The SI unit of force is:',
    type: 'Single Correct MCQ',
    subject: 'Physics',
    topic: 'Electromagnetism',
    difficulty: 'Easy',
    options: ['Joule', 'Watt', 'Newton', 'Pascal'],
    correctAnswer: 'Newton',
    explanation: 'Force is measured in newtons in the SI system.',
    positiveMarks: 4,
    negativeMarks: 1,
    tags: ['units', 'force'],
  },
];

const additionalQuestions = [
  ['Mathematics', 'Algebra', 'Solve: 3x − 7 = 11.', ['4', '5', '6', '7'], 2, 'Add 7 to both sides and divide by 3: x = 6.', 'Easy'],
  ['Mathematics', 'Algebra', 'What is the factorisation of x² − 9?', ['(x − 9)(x + 1)', '(x − 3)(x + 3)', '(x − 3)²', '(x + 9)(x − 1)'], 1, 'This is a difference of squares: x² − 3² = (x − 3)(x + 3).', 'Easy'],
  ['Mathematics', 'Calculus', 'What is the derivative of x³?', ['x²', '2x²', '3x²', '3x'], 2, 'By the power rule, d(xⁿ)/dx = nxⁿ⁻¹, so the derivative is 3x².', 'Easy'],
  ['Mathematics', 'Calculus', 'Evaluate the definite integral ∫₀² 2x dx.', ['2', '4', '6', '8'], 1, 'The antiderivative is x²; x² evaluated from 0 to 2 is 4.', 'Medium'],
  ['Mathematics', 'Trigonometry', 'What is sin 30°?', ['0', '1/2', '√2/2', '1'], 1, 'The standard value of sin 30° is 1/2.', 'Easy'],
  ['Mathematics', 'Geometry', 'What is the area of a circle with radius 3 units?', ['3π', '6π', '9π', '12π'], 2, 'Area = πr² = π × 3² = 9π square units.', 'Easy'],
  ['Mathematics', 'Probability', 'A fair coin is tossed once. What is the probability of getting heads?', ['0', '1/4', '1/2', '1'], 2, 'There is one favourable outcome among two equally likely outcomes.', 'Easy'],
  ['Mathematics', 'Statistics', 'What is the median of 2, 4, 7, 9, 12?', ['4', '7', '8', '9'], 1, 'The middle value in the ordered list is 7.', 'Easy'],
  ['Physics', 'Motion', 'A 2 kg object accelerates at 3 m/s². What net force acts on it?', ['1.5 N', '5 N', '6 N', '9 N'], 2, 'Newton’s second law gives F = ma = 2 × 3 = 6 N.', 'Easy'],
  ['Physics', 'Motion', 'A runner covers 150 m in 30 s at constant speed. What is the speed?', ['3 m/s', '5 m/s', '6 m/s', '8 m/s'], 1, 'Speed = distance / time = 150 / 30 = 5 m/s.', 'Easy'],
  ['Physics', 'Motion', 'An object starts from rest and accelerates at 2 m/s² for 4 s. What is its final speed?', ['4 m/s', '6 m/s', '8 m/s', '10 m/s'], 2, 'Using v = u + at, v = 0 + 2 × 4 = 8 m/s.', 'Medium'],
  ['Physics', 'Work and Energy', 'How much work is done by a 10 N force moving an object 3 m in its direction?', ['13 J', '30 J', '3.3 J', '0 J'], 1, 'Work = force × displacement in the force direction = 10 × 3 = 30 J.', 'Easy'],
  ['Physics', 'Work and Energy', 'What is the kinetic energy of a 2 kg object moving at 3 m/s?', ['6 J', '9 J', '12 J', '18 J'], 1, 'Kinetic energy = ½mv² = ½ × 2 × 9 = 9 J.', 'Medium'],
  ['Physics', 'Waves', 'A wave has frequency 5 Hz and wavelength 2 m. What is its speed?', ['2.5 m/s', '7 m/s', '10 m/s', '25 m/s'], 2, 'Wave speed = frequency × wavelength = 5 × 2 = 10 m/s.', 'Easy'],
  ['Physics', 'Electricity', 'What current flows through a 4 Ω resistor connected to 12 V?', ['2 A', '3 A', '4 A', '48 A'], 1, 'Ohm’s law gives I = V/R = 12/4 = 3 A.', 'Easy'],
  ['Physics', 'Electricity', 'Two 2 Ω resistors are connected in series. What is their equivalent resistance?', ['1 Ω', '2 Ω', '4 Ω', '8 Ω'], 2, 'Series resistances add: 2 Ω + 2 Ω = 4 Ω.', 'Easy'],
  ['Chemistry', 'Atomic Structure', 'What is the atomic number of carbon?', ['4', '6', '8', '12'], 1, 'A carbon atom has six protons, so its atomic number is 6.', 'Easy'],
  ['Chemistry', 'Atomic Structure', 'Which subatomic particle has a negative charge?', ['Proton', 'Neutron', 'Electron', 'Nucleus'], 2, 'Electrons carry a negative electric charge.', 'Easy'],
  ['Chemistry', 'Periodic Table', 'Which element is in Group 18, Period 2?', ['Helium', 'Neon', 'Argon', 'Krypton'], 1, 'Neon is the Group 18 noble gas in Period 2.', 'Easy'],
  ['Chemistry', 'Acids and Bases', 'What is the approximate pH of a neutral aqueous solution at 25°C?', ['0', '5', '7', '14'], 2, 'At 25°C, a neutral aqueous solution has pH 7.', 'Easy'],
  ['Chemistry', 'Chemical Bonding', 'What type of bond forms when atoms share electron pairs?', ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], 1, 'A covalent bond forms through sharing of electron pairs.', 'Easy'],
  ['Chemistry', 'Mole Concept', 'How many moles are present in 18 g of water? (Molar mass = 18 g/mol)', ['0.5 mol', '1 mol', '2 mol', '18 mol'], 1, 'Moles = mass / molar mass = 18 / 18 = 1 mol.', 'Easy'],
  ['Chemistry', 'Organic Chemistry', 'Which functional group characterises alcohols?', ['−COOH', '−CHO', '−OH', '−NH₂'], 2, 'Alcohols contain the hydroxyl functional group, −OH.', 'Easy'],
  ['Biology', 'Cell Biology', 'Which organelle is the main site of aerobic cellular respiration?', ['Ribosome', 'Mitochondrion', 'Golgi apparatus', 'Lysosome'], 1, 'Most aerobic respiration and ATP production occur in mitochondria.', 'Easy'],
  ['Biology', 'Cell Biology', 'Which structure controls what enters and leaves a cell?', ['Cell membrane', 'Nucleolus', 'Cell wall only', 'Chromosome'], 0, 'The selectively permeable cell membrane regulates movement into and out of the cell.', 'Easy'],
  ['Biology', 'Genetics', 'How many chromosomes are present in a typical human body cell?', ['23', '44', '46', '48'], 2, 'A typical human somatic cell has 46 chromosomes arranged in 23 pairs.', 'Easy'],
  ['Biology', 'Genetics', 'Which molecule carries most hereditary information in living organisms?', ['ATP', 'DNA', 'Glucose', 'Lipid'], 1, 'DNA stores hereditary information in most organisms.', 'Easy'],
  ['Biology', 'Human Physiology', 'Which blood cells primarily transport oxygen?', ['Platelets', 'Red blood cells', 'White blood cells', 'Plasma cells'], 1, 'Haemoglobin in red blood cells binds and transports oxygen.', 'Easy'],
  ['Biology', 'Human Physiology', 'Which organ pumps blood through the human circulatory system?', ['Liver', 'Lungs', 'Heart', 'Kidney'], 2, 'The heart contracts to pump blood through pulmonary and systemic circulation.', 'Easy'],
  ['Biology', 'Ecology', 'Which organisms are primary producers in most terrestrial ecosystems?', ['Fungi', 'Green plants', 'Carnivores', 'Decomposers'], 1, 'Green plants capture light energy and produce organic matter through photosynthesis.', 'Easy'],
  ['Computer Science', 'Data Structures', 'Which data structure follows the Last In, First Out (LIFO) rule?', ['Queue', 'Stack', 'Graph', 'Heap'], 1, 'A stack removes the most recently added item first.', 'Easy'],
  ['Computer Science', 'Data Structures', 'Which data structure follows the First In, First Out (FIFO) rule?', ['Stack', 'Queue', 'Tree', 'Set'], 1, 'A queue processes items in the order they were added.', 'Easy'],
  ['Computer Science', 'Algorithms', 'What is the time complexity of binary search on a sorted array?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 1, 'Binary search halves the remaining search interval at each step.', 'Medium'],
  ['Computer Science', 'Algorithms', 'Which sorting algorithm repeatedly compares and swaps adjacent out-of-order elements?', ['Merge sort', 'Bubble sort', 'Selection sort', 'Heap sort'], 1, 'Bubble sort compares neighbouring elements and swaps them when needed.', 'Easy'],
  ['Computer Science', 'Programming', 'In many programming languages, which operator tests equality of two values?', ['=', '==', '=>', '!='], 1, 'In languages such as JavaScript, Python, and C, == is commonly used for equality comparison.', 'Easy'],
  ['Computer Science', 'Databases', 'What does a primary key identify in a relational table?', ['A duplicate row', 'A unique row', 'A table relationship only', 'A database server'], 1, 'A primary key uniquely identifies each row in a table.', 'Easy'],
  ['General Knowledge', 'Geography', 'What is the largest ocean on Earth?', ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], 3, 'The Pacific Ocean is the largest ocean by area.', 'Easy'],
  ['General Knowledge', 'Geography', 'What is the capital city of Japan?', ['Kyoto', 'Tokyo', 'Osaka', 'Nagoya'], 1, 'Tokyo is the capital of Japan.', 'Easy'],
  ['General Knowledge', 'Science', 'Which planet is known for its prominent ring system?', ['Mars', 'Venus', 'Saturn', 'Mercury'], 2, 'Saturn is especially known for its extensive visible ring system.', 'Easy'],
  ['General Knowledge', 'Environment', 'Which gas do plants absorb from the atmosphere during photosynthesis?', ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], 2, 'Plants use carbon dioxide as a carbon source during photosynthesis.', 'Easy'],
  ['General Knowledge', 'Space', 'Which star is closest to Earth?', ['Sirius', 'Proxima Centauri', 'The Sun', 'Betelgeuse'], 2, 'The Sun is the star closest to Earth.', 'Easy'],
  ['English', 'Grammar', 'Choose the grammatically correct sentence.', ['She go to school daily.', 'She goes to school daily.', 'She going to school daily.', 'She gone to school daily.'], 1, 'The singular subject “she” takes “goes” in the simple present tense.', 'Easy'],
  ['English', 'Vocabulary', 'Choose the closest meaning of “brief”.', ['Concise', 'Distant', 'Unclear', 'Ancient'], 0, '“Brief” means short in duration or concise in wording.', 'Easy'],
  ['English', 'Grammar', 'Which word is the adjective in “The bright lamp lit the room”?', ['lamp', 'bright', 'lit', 'room'], 1, '“Bright” describes the noun “lamp”, so it is an adjective.', 'Easy'],
  ['English', 'Punctuation', 'Which punctuation mark usually ends a direct question?', ['Comma', 'Colon', 'Question mark', 'Semicolon'], 2, 'A direct question normally ends with a question mark.', 'Easy'],
  ['Logical Reasoning', 'Series', 'Find the next number: 2, 4, 8, 16, __.', ['18', '24', '30', '32'], 3, 'Each term is multiplied by 2, so the next term is 32.', 'Easy'],
  ['Logical Reasoning', 'Series', 'Find the next letter: A, C, E, G, __.', ['H', 'I', 'J', 'K'], 1, 'The sequence advances by two letters each time; the next letter is I.', 'Easy'],
  ['Logical Reasoning', 'Analytical Reasoning', 'All roses are flowers. Which statement must be true?', ['All flowers are roses.', 'Some roses are not flowers.', 'Every rose is a flower.', 'No rose is a flower.'], 2, 'This restates the given relationship: every rose belongs to the set of flowers.', 'Easy'],
  ['Logical Reasoning', 'Analytical Reasoning', 'A is taller than B, and B is taller than C. Who is the shortest?', ['A', 'B', 'C', 'Cannot be determined'], 2, 'Since A > B > C in height, C is the shortest.', 'Easy'],
  ['Logical Reasoning', 'Coding-Decoding', 'If CAT is coded as DBU by shifting each letter one place forward, how is DOG coded?', ['EPH', 'CNG', 'EOG', 'FPH'], 0, 'Shift D→E, O→P, and G→H to get EPH.', 'Medium'],
].map(([subject, topic, questionText, options, correctIndex, explanation, difficulty], index) => ({
  id: `Q-${2001 + index}`,
  questionText,
  type: 'Single Correct MCQ',
  subject,
  topic,
  difficulty,
  options,
  correctAnswer: options[correctIndex],
  explanation,
  positiveMarks: 4,
  negativeMarks: 1,
  tags: [topic.toLowerCase()],
}));

function getInitialQuestions() {
  const storedQuestions = readStorage('smart-cbt-questions', defaultQuestions);
  const questions = Array.isArray(storedQuestions) ? [...storedQuestions] : [...defaultQuestions];
  const existingIds = new Set(questions.map((question) => question.id));

  additionalQuestions.forEach((question) => {
    if (!existingIds.has(question.id)) {
      questions.push(question);
      existingIds.add(question.id);
    }
  });

  return questions;
}

const defaultExams = [
  { id: 'EXM-1', name: 'JEE Main Mock Test 01', category: 'JEE Main', duration: 60, totalQuestions: 30, subjects: ['Physics', 'Chemistry', 'Mathematics'] },
  { id: 'EXM-2', name: 'NEET Practice Set', category: 'NEET', duration: 45, totalQuestions: 25, subjects: ['Biology', 'Chemistry'] },
];

const defaultResults = [
  { id: 'RES-1', examName: 'JEE Main Mock Test 01', score: 120, percentage: 80, correct: 22, incorrect: 5, unanswered: 3, accuracy: 82, duration: '00:52:30', completedAt: '2026-11-05' },
  { id: 'RES-2', examName: 'NEET Practice Set', score: 95, percentage: 75, correct: 18, incorrect: 7, unanswered: 0, accuracy: 72, duration: '00:40:15', completedAt: '2026-11-07' },
];

const defaultFlashcards = [
  { id: 'FC-1', front: 'What is Newton’s Second Law?', back: 'Force = mass × acceleration.', subject: 'Physics' },
  { id: 'FC-2', front: 'What is 5 × 5?', back: '25.', subject: 'Mathematics' },
  { id: 'FC-3', front: 'What is photosynthesis?', back: 'Plants convert sunlight, water, and carbon dioxide into glucose and oxygen.', subject: 'Biology' },
];

const defaultNotifications = [
  { id: 'NT-1', title: 'Daily challenge available', message: '10 questions are ready for today’s mixed-difficulty challenge.', read: false },
  { id: 'NT-2', title: 'Revision due', message: '3 Calculus questions need revision before your next mock test.', read: false },
  { id: 'NT-3', title: 'Weekly goal', message: 'You are 78% through your weekly Mathematics target.', read: true },
];

const defaultPlans = [
  { id: 'SP-1', title: 'Complete Calculus revision', subject: 'Mathematics', goal: 'Finish 3 topics', status: 'pending' },
  { id: 'SP-2', title: 'Physics motion revision', subject: 'Physics', goal: 'Solve 20 questions', status: 'in progress' },
  { id: 'SP-3', title: 'English reading practice', subject: 'English', goal: '1 timed passage', status: 'pending' },
];

const demoAttemptSeeds = [
  ['2026-09-10', 15, 14, 16, 10, 11, 9, 174],
  ['2026-09-13', 17, 15, 17, 10, 10, 9, 169],
  ['2026-09-16', 16, 16, 18, 9, 10, 9, 172],
  ['2026-09-19', 18, 16, 17, 9, 9, 10, 166],
  ['2026-09-22', 18, 17, 19, 9, 9, 8, 163],
  ['2026-09-25', 19, 16, 18, 8, 10, 9, 168],
  ['2026-09-28', 18, 18, 20, 8, 8, 8, 159],
  ['2026-10-01', 20, 17, 19, 8, 9, 8, 161],
  ['2026-10-04', 19, 19, 20, 8, 8, 7, 158],
  ['2026-10-07', 21, 18, 19, 7, 8, 8, 160],
  ['2026-10-10', 20, 19, 21, 7, 8, 7, 155],
  ['2026-10-13', 21, 20, 20, 7, 7, 7, 153],
  ['2026-10-16', 22, 19, 21, 6, 7, 7, 157],
  ['2026-10-19', 21, 21, 22, 7, 6, 6, 149],
  ['2026-10-22', 23, 20, 21, 6, 6, 7, 151],
  ['2026-10-25', 22, 21, 23, 6, 6, 5, 146],
  ['2026-10-28', 24, 21, 22, 5, 6, 6, 148],
  ['2026-10-31', 23, 22, 23, 5, 5, 5, 143],
  ['2026-11-02', 24, 22, 22, 5, 5, 6, 145],
  ['2026-11-03', 23, 23, 24, 5, 4, 4, 140],
  ['2026-11-04', 25, 22, 23, 4, 5, 5, 139],
  ['2026-11-05', 24, 23, 24, 4, 4, 4, 137],
  ['2026-11-06', 25, 23, 23, 4, 4, 5, 141],
  ['2026-11-07', 25, 24, 24, 4, 3, 3, 135],
];

const demoAnalyticsAttempts = demoAttemptSeeds.map(([completedAt, mathCorrect, physicsCorrect, chemistryCorrect, mathWrong, physicsWrong, chemistryWrong, durationMinutes], index) => {
  const topicSplit = (correct) => [Math.floor(correct / 2), Math.ceil(correct / 2)];
  const [calculus, algebra] = topicSplit(mathCorrect);
  const [motion, electromagnetism] = topicSplit(physicsCorrect);
  const [organicChemistry, physicalChemistry] = topicSplit(chemistryCorrect);

  return {
    id: `DEMO-${String(index + 1).padStart(2, '0')}`,
    examName: `JEE Main Mock ${String(index + 1).padStart(2, '0')}`,
    completedAt,
    durationMinutes,
    subjectCorrect: [mathCorrect, physicsCorrect, chemistryCorrect],
    subjectIncorrect: [mathWrong, physicsWrong, chemistryWrong],
    topicCorrect: [calculus, algebra, motion, electromagnetism, organicChemistry, physicalChemistry],
  };
});

const trendData = demoAnalyticsAttempts.map((attempt) => {
  const correct = attempt.subjectCorrect.reduce((sum, value) => sum + value, 0);
  const incorrect = attempt.subjectIncorrect.reduce((sum, value) => sum + value, 0);
  return {
    name: attempt.completedAt.slice(5),
    score: Math.round(((correct * 4 - incorrect) / 360) * 100),
  };
});

const demoSubjects = ['Mathematics', 'Physics', 'Chemistry'];
const demoTopics = ['Calculus', 'Algebra', 'Motion', 'Electromagnetism', 'Organic Chemistry', 'Physical Chemistry'];

const pieData = [
  { name: 'Correct', value: 72 },
  { name: 'Incorrect', value: 18 },
  { name: 'Unanswered', value: 10 },
];

const navItems = [
  { label: 'Home', path: '/', icon: Sparkles },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Question Bank', path: '/questions', icon: BookOpen },
  { label: 'Add Question', path: '/questions/new', icon: PlusCircle },
  { label: 'Create Exam', path: '/exams/new', icon: ClipboardList },
  { label: 'Smart Practice', path: '/practice', icon: Brain },
  { label: 'Analytics', path: '/analytics', icon: Activity },
  { label: 'Mistakes', path: '/mistakes', icon: NotebookPen },
  { label: 'Bookmarks', path: '/bookmarks', icon: BookMarked },
  { label: 'Flashcards', path: '/flashcards', icon: FileText },
  { label: 'Revision', path: '/revision', icon: Target },
  { label: 'Planner', path: '/planner', icon: ListChecks },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Backup', path: '/backup', icon: Download },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help', path: '/help', icon: HelpCircle },
];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

function AppLayout() {
  const [questions, setQuestions] = useState(getInitialQuestions);
  const [exams, setExams] = useState(() => readStorage('smart-cbt-exams', defaultExams));
  const [results, setResults] = useState(() => readStorage('smart-cbt-results', defaultResults));
  const [notifications, setNotifications] = useState(() => readStorage('smart-cbt-notifications', defaultNotifications));
  const [flashcards, setFlashcards] = useState(() => readStorage('smart-cbt-flashcards', defaultFlashcards));
  const [plans, setPlans] = useState(() => readStorage('smart-cbt-plans', defaultPlans));
  const [bookmarks, setBookmarks] = useState(() => readStorage('smart-cbt-bookmarks', []));
  const [theme, setTheme] = useState(() => localStorage.getItem('smart-cbt-theme') || 'light');

  useEffect(() => {
    localStorage.setItem('smart-cbt-questions', JSON.stringify(questions));
  }, [questions]);
  useEffect(() => {
    localStorage.setItem('smart-cbt-exams', JSON.stringify(exams));
  }, [exams]);
  useEffect(() => {
    localStorage.setItem('smart-cbt-results', JSON.stringify(results));
  }, [results]);
  useEffect(() => {
    localStorage.setItem('smart-cbt-notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('smart-cbt-flashcards', JSON.stringify(flashcards));
  }, [flashcards]);
  useEffect(() => {
    localStorage.setItem('smart-cbt-plans', JSON.stringify(plans));
  }, [plans]);
  useEffect(() => {
    localStorage.setItem('smart-cbt-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('smart-cbt-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon"><GraduationCap size={18} /></div>
          <div>
            <strong>Smart CBT</strong>
            <small>Exam Platform</small>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="ghost-btn" onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}>
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Student Portal</p>
            <h1>Computer-Based Test Suite</h1>
          </div>
          <div className="topbar-actions">
            <button className="ghost-btn" type="button">
              <Search size={14} />
              Quick Search
            </button>
            <Link className="primary-btn" to="/exams/new">
              <PlusCircle size={14} />
              New Mock Test
            </Link>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage questions={questions} results={results} exams={exams} notifications={notifications} />} />
          <Route path="/questions" element={<QuestionBankPage questions={questions} setQuestions={setQuestions} />} />
          <Route path="/questions/new" element={<QuestionEditorPage questions={questions} setQuestions={setQuestions} />} />
          <Route path="/questions/:id/edit" element={<QuestionEditorPage questions={questions} setQuestions={setQuestions} />} />
          <Route path="/exams/new" element={<ExamBuilderPage exams={exams} setExams={setExams} questions={questions} />} />
          <Route path="/exam/:examId" element={<ExamConsolePage questions={questions} exams={exams} results={results} setResults={setResults} />} />
          <Route path="/results/:resultId" element={<ResultsPage results={results} />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/practice" element={<PracticePage questions={questions} />} />
          <Route path="/mistakes" element={<MistakesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage bookmarks={bookmarks} setBookmarks={setBookmarks} questions={questions} />} />
          <Route path="/flashcards" element={<FlashcardsPage cards={flashcards} setCards={setFlashcards} />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/planner" element={<StudyPlannerPage plans={plans} setPlans={setPlans} />} />
          <Route path="/notifications" element={<NotificationsPage items={notifications} setItems={setNotifications} />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

function HomePage() {
  return (
    <div className="page-stack">
      <div className="card welcome-box">
        <div>
          <p className="eyebrow">Welcome</p>
          <h2>Prepare smarter for competitive exams.</h2>
          <p>Manage your question bank, create mock exams, track performance analytics, and build a revision workflow for long-term improvement.</p>
          <div className="cta-row">
            <Link className="primary-btn" to="/dashboard">Go to Dashboard</Link>
            <Link className="ghost-btn" to="/questions">View Question Bank</Link>
          </div>
        </div>
        <div className="mini-hero">
          <div className="mini-card success">
            <CheckCircle2 size={18} />
            <div>
              <strong>30-day streak</strong>
              <span>Daily study momentum</span>
            </div>
          </div>
          <div className="mini-card">
            <TimerReset size={18} />
            <div>
              <strong>90 min</strong>
              <span>Mock test endurance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ questions, results, exams, notifications }) {
  const stats = useMemo(() => {
    const totalQuestions = questions.length;
    const totalMockTests = exams.length;
    const testsCompleted = results.length;
    const avgScore = results.length ? Math.round(results.reduce((sum, item) => sum + Number(item.score || 0), 0) / results.length) : 0;
    const overallAccuracy = results.length ? Math.round(results.reduce((sum, item) => sum + Number(item.accuracy || 0), 0) / results.length) : 0;
    return { totalQuestions, totalMockTests, testsCompleted, avgScore, overallAccuracy };
  }, [questions, exams, results]);

  return (
    <div className="page-stack">
      <section className="dashboard-intro">
        <div className="dashboard-intro-copy">
          <span className="demo-pill"><span /> Sample workspace</span>
          <h2>Your next breakthrough starts here.</h2>
          <p>Build a steady rhythm: take a mock, learn from the result, and turn weak spots into strengths.</p>
        </div>
        <div className="dashboard-intro-actions">
          <Link className="primary-btn" to="/exams/new"><PlusCircle size={15} /> Build a mock test</Link>
          <span className="sample-note">Everything shown below is example data.</span>
        </div>
        <div className="intro-orbit orbit-one" />
        <div className="intro-orbit orbit-two" />
      </section>

      <div className="stats-grid">
        <StatCard title="Question bank" value={stats.totalQuestions} color="blue" />
        <StatCard title="Mock templates" value={stats.totalMockTests} color="purple" />
        <StatCard title="Demo attempts" value={stats.testsCompleted} color="green" />
        <StatCard title="Average demo score" value={stats.avgScore} color="amber" />
        <StatCard title="Demo accuracy" value={`${stats.overallAccuracy}%`} color="indigo" />
        <StatCard title="Study streak · demo" value="18 days" color="cyan" />
        <StatCard title="Revisions · demo" value="08" color="red" />
        <StatCard title="Bookmarks · demo" value="23" color="pink" />
      </div>

      <div className="main-grid">
        <div className="card wide">
          <div className="section-header"><h3>Pick up your practice</h3><span className="section-kicker">DEMO</span></div>
          <div className="continue-card">
            <div>
              <strong>JEE Main Mock Test 01</strong>
              <p>Progress: 35 / 90 questions</p>
              <p>Time Remaining: 01:25:30</p>
            </div>
            <Link className="primary-btn" to="/exam/EXM-1">Continue Exam</Link>
          </div>
        </div>

        <div className="card wide">
          <div className="section-header"><h3>Recent mock results</h3><span className="section-kicker">SAMPLE RECORDS</span></div>
          <div className="list-stack">
            {results.map((item) => (
              <div key={item.id} className="result-row">
                <div>
                  <strong>{item.examName}</strong>
                  <small>{item.completedAt}</small>
                </div>
                <span>{item.score} / 300</span>
                <span>{item.accuracy}% accuracy</span>
                <span>{item.duration}</span>
                <Link className="ghost-btn" to={`/results/${item.id}`}>View Result</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="card">
          <div className="section-header"><div><h3>Performance overview</h3><p className="chart-caption">Illustrative demo score trend</p></div></div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={4} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" name="Score" unit="%" stroke="#245c48" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-header"><h3>Subject snapshot · demo</h3></div>
          <div className="subject-list">
            <div><span>Mathematics</span><strong>78%</strong></div>
            <div><span>Physics</span><strong>62%</strong></div>
            <div><span>Chemistry</span><strong>85%</strong></div>
            <div><span>Biology</span><strong>70%</strong></div>
          </div>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="card">
          <div className="section-header"><h3>Weak Topics</h3></div>
          <ul className="bullet-list">
            <li>Calculus – 42% accuracy</li>
            <li>Electromagnetism – 48% accuracy</li>
            <li>Organic Chemistry – 55% accuracy</li>
          </ul>
        </div>

        <div className="card">
          <div className="section-header"><h3>Today’s Study Plan</h3></div>
          <ul className="bullet-list">
            <li>Mathematics: solve 15 algebra problems</li>
            <li>Physics: revise motion formulas</li>
            <li>Reading: 20-minute comprehension</li>
          </ul>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="card">
          <div className="section-header"><h3>Daily Challenge</h3></div>
          <p className="muted">10 Questions • 15 Minutes • Mixed Difficulty</p>
          <div className="progress-bar"><span style={{ width: '72%' }} /></div>
          <small>7/10 completed</small>
        </div>

        <div className="card">
          <div className="section-header"><h3>Upcoming Scheduled Exams</h3></div>
          <ul className="bullet-list">
            <li>JEE Main Drill – 12 Nov, 18:00</li>
            <li>Physics Mini-Test – 14 Nov, 17:00</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="section-header"><h3>Notifications</h3></div>
        <div className="list-stack compact">
          {notifications.slice(0, 3).map((item) => (
            <div key={item.id} className="notification-row">
              <strong>{item.title}</strong>
              <small>{item.message}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionBankPage({ questions, setQuestions }) {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesQuery = !query || `${q.questionText} ${q.subject} ${q.topic}`.toLowerCase().includes(query.toLowerCase());
      const matchesSubject = subject === 'All' || q.subject === subject;
      const matchesDifficulty = difficulty === 'All' || q.difficulty === difficulty;
      return matchesQuery && matchesSubject && matchesDifficulty;
    });
  }, [questions, query, subject, difficulty]);

  const handleDelete = (id) => {
    setQuestions((current) => current.filter((item) => item.id !== id));
    toast.success('Question removed');
  };

  return (
    <div className="page-stack">
      <div className="card toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions..." />
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="All">All Subjects</option>
          {subjectOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <Link className="primary-btn" to="/questions/new">Add Question</Link>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question) => (
              <tr key={question.id}>
                <td>{question.id}</td>
                <td>{question.questionText}</td>
                <td>{question.subject}</td>
                <td>{question.topic}</td>
                <td>{question.difficulty}</td>
                <td className="action-cell">
                  <Link to={`/questions/${question.id}/edit`} className="ghost-btn small">Edit</Link>
                  <button type="button" className="danger-btn small" onClick={() => handleDelete(question.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuestionEditorPage({ questions, setQuestions }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = questions.find((item) => item.id === id);

  const [form, setForm] = useState({
    id: existing?.id || '',
    questionText: existing?.questionText || '',
    type: existing?.type || 'Single Correct MCQ',
    subject: existing?.subject || 'Physics',
    topic: existing?.topic || 'Motion',
    difficulty: existing?.difficulty || 'Easy',
    options: existing?.options || ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: existing?.correctAnswer || 'Option A',
    explanation: existing?.explanation || '',
    positiveMarks: existing?.positiveMarks || 4,
    negativeMarks: existing?.negativeMarks || 1,
    tags: existing?.tags?.join(', ') || '',
  });

  useEffect(() => {
    if (!existing) return;
    setForm({
      id: existing.id,
      questionText: existing.questionText,
      type: existing.type,
      subject: existing.subject,
      topic: existing.topic,
      difficulty: existing.difficulty,
      options: existing.options,
      correctAnswer: existing.correctAnswer,
      explanation: existing.explanation,
      positiveMarks: existing.positiveMarks,
      negativeMarks: existing.negativeMarks,
      tags: existing.tags?.join(', ') || '',
    });
  }, [existing]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      id: form.id || `Q-${Date.now()}`,
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
    };

    setQuestions((current) => {
      const withoutCurrent = current.filter((item) => item.id !== payload.id);
      return [payload, ...withoutCurrent];
    });

    toast.success(existing ? 'Question updated' : 'Question saved');
    navigate('/questions');
  };

  return (
    <div className="card page-stack form-card">
      <div className="section-header"><h3>{existing ? 'Edit Question' : 'Add Question'}</h3></div>

      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-grid">
          <label>
            Question ID
            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
          </label>
          <label>
            Subject
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </label>
          <label>
            Topic
            <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </label>
          <label>
            Difficulty
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          <label>
            Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Single Correct MCQ</option>
              <option>Multiple Correct MCQ</option>
              <option>True / False</option>
              <option>Fill in the Blanks</option>
              <option>Numerical Answer</option>
            </select>
          </label>
          <label>
            Tags
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </label>
        </div>

        <label>
          Question Text
          <textarea rows="4" value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} />
        </label>

        <div className="option-list">
          {form.options.map((option, index) => (
            <label key={`opt-${index}`}>
              Option {index + 1}
              <input value={option} onChange={(e) => { const next = [...form.options]; next[index] = e.target.value; setForm({ ...form, options: next }); }} />
            </label>
          ))}
        </div>

        <label>
          Correct Answer
          <input value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} />
        </label>

        <label>
          Explanation
          <textarea rows="3" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
        </label>

        <div className="form-grid compact-grid">
          <label>
            Positive Marks
            <input type="number" value={form.positiveMarks} onChange={(e) => setForm({ ...form, positiveMarks: Number(e.target.value) })} />
          </label>
          <label>
            Negative Marks
            <input type="number" value={form.negativeMarks} onChange={(e) => setForm({ ...form, negativeMarks: Number(e.target.value) })} />
          </label>
        </div>

        <div className="action-row">
          <button type="submit" className="primary-btn">Save Question</button>
          <button type="button" className="ghost-btn" onClick={() => navigate('/questions')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function ExamBuilderPage({ exams, setExams, questions }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'JEE Main Mock Test 02',
    description: 'Custom mock test',
    category: 'JEE Main',
    duration: 60,
    totalQuestions: 30,
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    mode: 'Real Exam Mode',
  });
  const [selectedIds, setSelectedIds] = useState(() => questions
    .filter((question) => ['Physics', 'Chemistry', 'Mathematics'].includes(question.subject))
    .slice(0, 10)
    .map((question) => question.id));
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionSubject, setQuestionSubject] = useState('All');

  const availableQuestions = useMemo(() => questions.filter((question) => {
    const matchesSubject = questionSubject === 'All' || question.subject === questionSubject;
    const matchesSearch = !questionSearch
      || `${question.questionText} ${question.topic} ${question.subject}`.toLowerCase().includes(questionSearch.toLowerCase());
    return matchesSubject && matchesSearch;
  }), [questions, questionSubject, questionSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedIds.length === 0) {
      toast.error('Select at least one question for your test');
      return;
    }

    const exam = {
      ...form,
      id: `EXM-${Date.now()}`,
      totalQuestions: selectedIds.length,
      duration: Number(form.duration),
      questionIds: selectedIds,
      createdAt: new Date().toISOString(),
    };
    setExams((current) => [exam, ...current]);
    toast.success(`${selectedIds.length} questions added to your test`);
    navigate(`/exam/${exam.id}`);
  };

  return (
    <div className="page-stack exam-builder-page">
      <section className="builder-heading">
        <div>
          <span className="revision-kicker"><ClipboardList size={14} /> MOCK TEST BUILDER</span>
          <h2>Make this test yours.</h2>
          <p>Set the basics, choose questions from your bank, and start when your test is ready.</p>
        </div>
        <div className="builder-selection-count">
          <strong>{selectedIds.length}</strong>
          <span>questions selected</span>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="exam-builder-layout">
        <div className="builder-main">
          <section className="card builder-section">
            <div className="builder-section-title">
              <span className="builder-step">01</span>
              <div><h3>Test details</h3><p>Name your test and set the format.</p></div>
            </div>
            <div className="form-grid">
              <label>Test name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Exam category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>JEE Main</option><option>NEET</option><option>GATE</option><option>UPSC</option><option>Custom Exam</option></select></label>
              <label>Duration in minutes<input min="1" max="600" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} /></label>
              <label>Test mode<select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}><option>Practice Mode</option><option>Real Exam Mode</option><option>Section-wise Mode</option></select></label>
            </div>
            <label className="builder-description">Description<textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          </section>

          <section className="card builder-section">
            <div className="builder-section-title">
              <span className="builder-step">02</span>
              <div><h3>Choose questions</h3><p>Pick specific questions from your bank.</p></div>
            </div>
            <div className="question-picker-toolbar">
              <input aria-label="Search question bank" value={questionSearch} onChange={(e) => setQuestionSearch(e.target.value)} placeholder="Search by question or topic" />
              <select aria-label="Filter questions by subject" value={questionSubject} onChange={(e) => setQuestionSubject(e.target.value)}>
                <option value="All">All subjects</option>
                {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
              <button
                type="button"
                className="ghost-btn small"
                onClick={() => {
                  const filteredIds = availableQuestions.map((question) => question.id);
                  setSelectedIds((current) => [...new Set([...current, ...filteredIds])]);
                }}
              >
                Add all shown
              </button>
            </div>

            <div className="question-picker-list">
              {availableQuestions.map((question) => {
                const checked = selectedIds.includes(question.id);
                return (
                  <label className={`question-picker-row ${checked ? 'is-selected' : ''}`} key={question.id}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setSelectedIds((current) => (
                        checked ? current.filter((id) => id !== question.id) : [...current, question.id]
                      ))}
                    />
                    <span className="question-picker-copy">
                      <strong>{question.questionText}</strong>
                      <small>{question.subject} <span>·</span> {question.topic} <span>·</span> {question.difficulty}</small>
                    </span>
                    <span className="question-picker-mark">{question.positiveMarks ?? 4} marks</span>
                  </label>
                );
              })}
              {availableQuestions.length === 0 && <p className="question-picker-empty">No questions match those filters.</p>}
            </div>
          </section>
        </div>

        <aside className="card builder-summary">
          <span className="section-kicker">TEST SUMMARY</span>
          <h3>{form.name || 'Untitled test'}</h3>
          <div className="builder-summary-stat"><span>Questions</span><strong>{selectedIds.length}</strong></div>
          <div className="builder-summary-stat"><span>Duration</span><strong>{form.duration} min</strong></div>
          <div className="builder-summary-stat"><span>Subjects</span><strong>{new Set(questions.filter((question) => selectedIds.includes(question.id)).map((question) => question.subject)).size}</strong></div>
          <p>Each selected question will appear in the test. You can adjust this selection before starting.</p>
          <button className="primary-btn builder-submit" type="submit" disabled={selectedIds.length === 0}>
            Start test <PlusCircle size={15} />
          </button>
          <button className="ghost-btn builder-cancel" type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
        </aside>
      </form>
    </div>
  );
}

function ExamConsolePage({ questions, exams, results, setResults }) {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = exams.find((item) => item.id === examId);
  const selectedQuestions = useMemo(() => {
    if (exam?.questionIds?.length) {
      const byId = new Map(questions.map((question) => [question.id, question]));
      return exam.questionIds.map((id) => byId.get(id)).filter(Boolean);
    }
    return questions.slice(0, Math.min(10, questions.length));
  }, [questions, exam]);
  const [restoredAttempt] = useState(() => readStorage(`smart-cbt-exam-${examId}`, null));
  const durationSeconds = Math.max(1, Number(exam?.duration || 15)) * 60;
  const [answers, setAnswers] = useState(() => restoredAttempt?.answers || {});
  const [review, setReview] = useState(() => restoredAttempt?.review || {});
  const [visited, setVisited] = useState(() => restoredAttempt?.visited || { 0: true });
  const [currentIndex, setCurrentQuestionIndex] = useState(() => restoredAttempt?.currentIndex || 0);
  const [endAt] = useState(() => restoredAttempt?.endAt || Date.now() + (restoredAttempt?.timeLeft ?? durationSeconds) * 1000);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
  const [showSubmitSummary, setShowSubmitSummary] = useState(false);
  const submittedRef = useRef(false);
  const submitExamRef = useRef(() => {});

  useEffect(() => {
    localStorage.setItem(`smart-cbt-exam-${examId}`, JSON.stringify({
      answers,
      review,
      visited,
      currentIndex,
      endAt,
      timeLeft,
    }));
  }, [answers, review, visited, currentIndex, endAt, timeLeft, examId]);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) submitExamRef.current(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [endAt]);

  const currentQuestion = selectedQuestions[currentIndex] || null;

  const answerCount = Object.keys(answers).length;
  const reviewCount = Object.keys(review).filter((index) => review[index]).length;
  const unansweredCount = selectedQuestions.length - answerCount;
  const notVisitedCount = selectedQuestions.filter((_, index) => !visited[index]).length;
  const goToQuestion = (index) => {
    const nextIndex = Math.max(0, Math.min(index, selectedQuestions.length - 1));
    setCurrentQuestionIndex(nextIndex);
    setVisited((current) => ({ ...current, [nextIndex]: true }));
  };

  const submitExam = (automatic = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const total = selectedQuestions.length;
    const unanswered = total - answerCount;
    const correct = selectedQuestions.reduce((sum, question, index) => sum + (String(answers[index]) === String(question.correctAnswer) ? 1 : 0), 0);
    const incorrect = total - correct - unanswered;
    const score = selectedQuestions.reduce((total, question, index) => {
      if (!Object.prototype.hasOwnProperty.call(answers, index)) return total;
      return total + (String(answers[index]) === String(question.correctAnswer)
        ? Number(question.positiveMarks ?? 4)
        : -Number(question.negativeMarks ?? 1));
    }, 0);
    const maxScore = selectedQuestions.reduce((total, question) => total + Number(question.positiveMarks ?? 4), 0);
    const result = {
      id: `RES-${Date.now()}`,
      examName: exam?.name || `Exam ${examId}`,
      score,
      percentage: maxScore ? Math.round((score / maxScore) * 100) : 0,
      correct,
      incorrect,
      unanswered,
      accuracy: correct + incorrect ? Math.round((correct / (correct + incorrect)) * 100) : 0,
      duration: formatDuration(Math.min(durationSeconds, Math.max(0, durationSeconds - timeLeft))),
      totalMarks: maxScore,
      questionIds: selectedQuestions.map((question) => question.id),
      questions: selectedQuestions.map((question) => ({
        id: question.id,
        subject: question.subject,
        topic: question.topic,
        difficulty: question.difficulty,
      })),
      answers: selectedQuestions.map((question, index) => ({
        questionId: question.id,
        questionText: question.questionText,
        selectedAnswer: answers[index] ?? null,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        marks: Object.prototype.hasOwnProperty.call(answers, index)
          ? (String(answers[index]) === String(question.correctAnswer) ? Number(question.positiveMarks ?? 4) : -Number(question.negativeMarks ?? 1))
          : 0,
      })),
      completedAt: new Date().toLocaleDateString(),
    };
    setResults((current) => [result, ...current]);
    localStorage.setItem('smart-cbt-last-result', JSON.stringify(result));
    localStorage.removeItem(`smart-cbt-exam-${examId}`);
    toast.success(automatic ? 'Time is up. Your exam was submitted.' : 'Exam submitted successfully');
    navigate(`/results/${result.id}`);
  };
  submitExamRef.current = submitExam;

  const handleSelectAnswer = (option) => {
    setAnswers((current) => ({ ...current, [currentIndex]: option }));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement
        && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (isTyping || event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 's') {
        event.preventDefault();
        goToQuestion(currentIndex + 1);
      } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'p') {
        event.preventDefault();
        goToQuestion(currentIndex - 1);
      } else if (event.key.toLowerCase() === 'm') {
        setReview((current) => ({ ...current, [currentIndex]: !current[currentIndex] }));
      } else if (event.key.toLowerCase() === 'c') {
        setAnswers((current) => {
          const next = { ...current };
          delete next[currentIndex];
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedQuestions.length]);

  if (!currentQuestion) {
    return <div className="card">No question available.</div>;
  }

  return (
    <div className="exam-shell">
      <div className="exam-topbar card">
        <div>
          <span className="eyebrow">{exam?.category || 'Mock test'}</span>
          <strong>{exam?.name || examId}</strong>
        </div>
        <div className="exam-topbar-status">
          <span className="exam-progress-label">{answerCount} of {selectedQuestions.length} answered</span>
          <div className={`timer-box ${timeLeft <= 300 ? 'timer-warning' : ''}`} aria-live="polite">
            <TimerReset size={16} /> {formatDuration(timeLeft)}
          </div>
        </div>
      </div>

      <div className="exam-body">
        <aside className="question-palette card">
          <div className="palette-heading">
            <div><h3>Question palette</h3><span>{selectedQuestions.length} questions</span></div>
            <strong>{currentIndex + 1}<small>/{selectedQuestions.length}</small></strong>
          </div>
          <div className="palette-legend">
            <span><i className="legend-dot answered" /> Answered <b>{answerCount}</b></span>
            <span><i className="legend-dot review" /> Review <b>{reviewCount}</b></span>
            <span><i className="legend-dot unanswered" /> Open <b>{unansweredCount}</b></span>
          </div>
          <div className="palette-grid">
            {selectedQuestions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                aria-label={`Question ${index + 1}${answers[index] ? ', answered' : ', unanswered'}${review[index] ? ', marked for review' : ''}`}
                className={`palette-btn ${currentIndex === index ? 'active' : ''} ${visited[index] && !answers[index] ? 'visited' : ''} ${answers[index] ? 'answered' : ''} ${review[index] ? 'review' : ''} ${answers[index] && review[index] ? 'answered-review' : ''}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="exam-shortcuts">
            <span>Keyboard shortcuts</span>
            <small><kbd>←</kbd><kbd>→</kbd> Navigate <kbd>M</kbd> Review</small>
            <small><kbd>C</kbd> Clear <kbd>S</kbd> Save & next</small>
          </div>
        </aside>

        <section className="exam-question card">
          <div className="exam-question-topline">
            <p className="question-meta">QUESTION {String(currentIndex + 1).padStart(2, '0')} <span>OF {String(selectedQuestions.length).padStart(2, '0')}</span></p>
            <div className="question-tags">
              <span>{currentQuestion.subject}</span>
              <span>{currentQuestion.difficulty || 'Standard'}</span>
              <span>{currentQuestion.positiveMarks ?? 4} marks</span>
            </div>
          </div>
          <h3>{currentQuestion.questionText}</h3>
          <div className="option-list vertical">
            {currentQuestion.options.map((option, optionIndex) => (
              <label key={`${currentQuestion.id}-${optionIndex}`} className={`option-item ${String(answers[currentIndex]) === String(option) ? 'selected' : ''}`}>
                <input type="radio" name={`q-${currentIndex}`} checked={String(answers[currentIndex]) === String(option)} onChange={() => handleSelectAnswer(option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="exam-actions card">
        <button type="button" className="ghost-btn" disabled={currentIndex === 0} onClick={() => goToQuestion(currentIndex - 1)}>Previous</button>
        <div className="exam-action-secondary">
          <button type="button" className="ghost-btn" onClick={() => {
            setAnswers((current) => {
              const next = { ...current };
              delete next[currentIndex];
              return next;
            });
          }}>Clear response</button>
          <button type="button" className={`ghost-btn ${review[currentIndex] ? 'review-active' : ''}`} onClick={() => setReview((current) => ({ ...current, [currentIndex]: !current[currentIndex] }))}>
            {review[currentIndex] ? 'Unmark review' : 'Mark for review'}
          </button>
        </div>
        <button type="button" className="primary-btn" onClick={() => goToQuestion(currentIndex + 1)} disabled={currentIndex === selectedQuestions.length - 1}>Save & next</button>
        <button type="button" className="danger-btn" onClick={() => setShowSubmitSummary(true)}>Submit test</button>
      </div>

      {showSubmitSummary && (
        <div className="submit-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowSubmitSummary(false);
        }}>
          <section className="submit-dialog" role="dialog" aria-modal="true" aria-labelledby="submit-title">
            <span className="submit-dialog-icon"><ClipboardList size={20} /></span>
            <p className="section-kicker">FINAL CHECK</p>
            <h2 id="submit-title">Submit this test?</h2>
            <p className="submit-description">Your answers will be locked and your result will be calculated.</p>
            <div className="submit-summary-grid">
              <div><span>Answered</span><strong>{answerCount}</strong></div>
              <div><span>Unanswered</span><strong>{unansweredCount}</strong></div>
              <div><span>Marked for review</span><strong>{reviewCount}</strong></div>
              <div><span>Not visited</span><strong>{notVisitedCount}</strong></div>
            </div>
            <div className="submit-dialog-actions">
              <button type="button" className="ghost-btn" onClick={() => setShowSubmitSummary(false)}>Keep working</button>
              <button type="button" className="danger-btn" onClick={() => submitExam(false)}>Submit and finish</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ResultsPage({ results }) {
  const { resultId } = useParams();
  const result = results.find((item) => item.id === resultId) || readStorage('smart-cbt-last-result', null);

  if (!result) {
    return <div className="card"><p>No result available yet.</p></div>;
  }

  return (
    <div className="page-stack">
      <div className="card result-header">
        <div>
          <p className="eyebrow">Exam Result</p>
          <h2>{result.examName}</h2>
        </div>
        <div className="score-block">
          <strong>{result.score}</strong>
          <span>{result.percentage}%</span>
        </div>
      </div>

      <div className="stats-grid compact-grid">
        <StatCard title="Correct" value={result.correct} color="green" />
        <StatCard title="Incorrect" value={result.incorrect} color="red" />
        <StatCard title="Unanswered" value={result.unanswered} color="blue" />
        <StatCard title="Accuracy" value={`${result.accuracy}%`} color="purple" />
      </div>

      <div className="two-column-grid">
        <div className="card">
          <div className="section-header"><h3>Correct vs Incorrect</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-header"><h3>Subject-wise Performance</h3></div>
          <div className="subject-list">
            <div><span>Mathematics</span><strong>82%</strong></div>
            <div><span>Physics</span><strong>74%</strong></div>
            <div><span>Chemistry</span><strong>89%</strong></div>
          </div>
        </div>
      </div>

      <div className="action-row">
        <Link className="primary-btn" to="/analytics">View Analytics</Link>
        <Link className="ghost-btn" to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const analysis = useMemo(() => {
    const attempts = demoAnalyticsAttempts.map((attempt) => {
      const correct = attempt.subjectCorrect.reduce((sum, value) => sum + value, 0);
      const incorrect = attempt.subjectIncorrect.reduce((sum, value) => sum + value, 0);
      const score = correct * 4 - incorrect;
      return {
        ...attempt,
        correct,
        incorrect,
        unanswered: 90 - correct - incorrect,
        score,
        scorePercent: Math.round((score / 360) * 100),
        accuracy: Math.round((correct / (correct + incorrect)) * 100),
      };
    });

    const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
    const totalAttempted = attempts.reduce((sum, attempt) => sum + attempt.correct + attempt.incorrect, 0);
    const averageScore = Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length);
    const first = attempts[0];
    const latest = attempts[attempts.length - 1];
    const subjectRows = demoSubjects.map((name, subjectIndex) => {
      const correct = attempts.reduce((sum, attempt) => sum + attempt.subjectCorrect[subjectIndex], 0);
      const incorrect = attempts.reduce((sum, attempt) => sum + attempt.subjectIncorrect[subjectIndex], 0);
      return { name, correct, attempted: correct + incorrect, accuracy: Math.round((correct / (correct + incorrect)) * 100) };
    });
    const topicRows = demoTopics.map((name, topicIndex) => {
      const correct = attempts.reduce((sum, attempt) => sum + attempt.topicCorrect[topicIndex], 0);
      const attempted = attempts.length * 15;
      return { name, correct, attempted, accuracy: Math.round((correct / attempted) * 100) };
    }).sort((a, b) => a.accuracy - b.accuracy);

    return {
      attempts,
      averageScore,
      averageScorePercent: Math.round((averageScore / 360) * 100),
      overallAccuracy: Math.round((totalCorrect / totalAttempted) * 100),
      averageDuration: Math.round(attempts.reduce((sum, attempt) => sum + attempt.durationMinutes, 0) / attempts.length),
      scoreImprovement: latest.score - first.score,
      scorePercentImprovement: latest.scorePercent - first.scorePercent,
      subjectRows,
      topicRows,
      weakestTopic: topicRows[0],
      strongestTopic: topicRows[topicRows.length - 1],
    };
  }, []);

  const metrics = [
    { title: 'Mock attempts', value: analysis.attempts.length, detail: '24 dated sample records', color: 'green' },
    { title: 'Average score', value: `${analysis.averageScore} / 360`, detail: `${analysis.averageScorePercent}% of max marks`, color: 'amber' },
    { title: 'Overall accuracy', value: `${analysis.overallAccuracy}%`, detail: 'Correct / attempted answers', color: 'indigo' },
    { title: 'Score improvement', value: `+${analysis.scoreImprovement}`, detail: `+${analysis.scorePercentImprovement} percentage points`, color: 'cyan' },
  ];

  const recommendations = [
    {
      title: `Prioritize ${analysis.weakestTopic.name}`,
      detail: `${analysis.weakestTopic.accuracy}% accuracy across ${analysis.weakestTopic.attempted} demo questions. Revisit core concepts, then try a short targeted set.`,
    },
    {
      title: `Keep building on ${analysis.strongestTopic.name}`,
      detail: `${analysis.strongestTopic.accuracy}% accuracy makes this the strongest topic in this sample. Use spaced revision to retain it.`,
    },
    {
      title: 'Review pacing after each section',
      detail: `Average completion time is ${analysis.averageDuration} minutes for a 90-question mock. Check your per-question timing before the next attempt.`,
    },
  ];

  return (
    <div className="page-stack analytics-page">
      <section className="analysis-heading">
        <div>
          <span className="demo-pill light"><span /> Synthetic demo dataset</span>
          <h2>Performance, made clear.</h2>
          <p>24 sample JEE-style mock attempts · 90 questions each · results are illustrative, not official exam material.</p>
        </div>
        <div className="analysis-period">
          <span>DATE RANGE</span>
          <strong>10 Sep — 07 Nov 2026</strong>
        </div>
      </section>

      <div className="stats-grid compact-grid analysis-metrics">
        {metrics.map((item) => (
          <div className={`analysis-metric ${item.color}`} key={item.title}>
            <span>{item.title}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        <section className="card analytics-chart-card">
          <div className="section-header">
            <div>
              <h3>Score and accuracy trend</h3>
              <p className="chart-caption">Score is calculated as correct × 4 − incorrect.</p>
            </div>
            <span className="section-kicker">24 ATTEMPTS</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analysis.attempts} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="completedAt" interval={3} tickFormatter={(value) => value.slice(5)} tickLine={false} axisLine={false} />
              <YAxis yAxisId="score" domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
              <Tooltip labelFormatter={(value) => `Date: ${value}`} formatter={(value, name) => [`${value}%`, name]} />
              <Line yAxisId="score" type="monotone" dataKey="scorePercent" name="Score" stroke="#245c48" strokeWidth={3} dot={{ r: 4, fill: '#d7f36a', stroke: '#245c48', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line yAxisId="score" type="monotone" dataKey="accuracy" name="Accuracy" stroke="#b17b35" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="card analytics-chart-card">
          <div className="section-header">
            <div>
              <h3>Subject accuracy</h3>
              <p className="chart-caption">Weighted across all sample attempts.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analysis.subjectRows} layout="vertical" margin={{ top: 4, right: 18, bottom: 4, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={105} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value, name, item) => [`${value}% · ${item.payload.correct}/${item.payload.attempted}`, 'Accuracy']} />
              <Bar dataKey="accuracy" fill="#477c61" radius={[0, 6, 6, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="analytics-grid">
        <section className="card analytics-chart-card topic-analysis">
          <div className="section-header">
            <div>
              <h3>Topic strengths and gaps</h3>
              <p className="chart-caption">Topic accuracy is calculated over 360 demo questions per topic.</p>
            </div>
          </div>
          <div className="topic-list">
            {analysis.topicRows.map((topic) => {
              const status = topic.accuracy < 65 ? 'Needs focus' : topic.accuracy < 80 ? 'Building' : 'Strong';
              return (
                <div className="topic-row" key={topic.name}>
                  <div className="topic-title">
                    <strong>{topic.name}</strong>
                    <span>{topic.correct}/{topic.attempted} correct</span>
                  </div>
                  <div className="topic-track"><span style={{ width: `${topic.accuracy}%` }} /></div>
                  <strong className="topic-percent">{topic.accuracy}%</strong>
                  <span className={`topic-status ${status === 'Strong' ? 'positive' : status === 'Building' ? 'neutral' : 'attention'}`}>{status}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card insight-card">
          <div className="section-header">
            <div>
              <span className="section-kicker">RULE-BASED SUMMARY</span>
              <h3>What the sample suggests</h3>
            </div>
            <Sparkles size={18} />
          </div>
          <div className="insight-callout">
            <strong>Steady upward trend</strong>
            <p>Sample score moved from {analysis.attempts[0].score}/360 to {analysis.attempts.at(-1).score}/360 across eight attempts.</p>
          </div>
          <div className="recommendation-list">
            {recommendations.map((item, index) => (
              <div className="recommendation-item" key={item.title}>
                <span className="recommendation-number">0{index + 1}</span>
                <div><strong>{item.title}</strong><p>{item.detail}</p></div>
              </div>
            ))}
          </div>
          <p className="analysis-disclaimer">These recommendations use simple thresholds and sample records. They are not AI predictions or personal results.</p>
        </section>
      </div>

      <section className="card attempt-table-card">
        <div className="section-header">
          <div><h3>Attempt-by-attempt breakdown</h3><p className="chart-caption">All records in this table are generated demo data.</p></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Attempt</th><th>Date</th><th>Score</th><th>Accuracy</th><th>Correct</th><th>Incorrect</th><th>Unanswered</th><th>Duration</th></tr></thead>
            <tbody>
              {analysis.attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.examName}</td>
                  <td>{attempt.completedAt}</td>
                  <td><strong>{attempt.score}/360</strong></td>
                  <td>{attempt.accuracy}%</td>
                  <td>{attempt.correct}</td>
                  <td>{attempt.incorrect}</td>
                  <td>{attempt.unanswered}</td>
                  <td>{attempt.durationMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PracticePage({ questions }) {
  const [selectedCategory, setSelectedCategory] = useState('All Questions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const curatedQuestions = questions.slice(0, 4);
  const currentQuestion = curatedQuestions[currentIndex];

  return (
    <div className="page-stack">
      <div className="card toolbar">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option>All Questions</option>
          <option>Subject-wise</option>
          <option>Bookmarked Questions</option>
          <option>Incorrect Questions</option>
        </select>
      </div>

      {currentQuestion ? (
        <div className="card exam-question">
          <p className="question-meta">Practice Question {currentIndex + 1}</p>
          <h3>{currentQuestion.questionText}</h3>
          <div className="option-list vertical">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option-item">
                <input type="radio" name="practice-answer" />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div className="action-row">
            <button type="button" className="primary-btn" onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, curatedQuestions.length - 1))}>Next Question</button>
          </div>
        </div>
      ) : <div className="card">No practice question available.</div>}
    </div>
  );
}

function MistakesPage() {
  const mistakes = [
    { id: 'M-1', topic: 'Calculus', wrongAttempts: 3, lastAttempt: '08 Nov', status: 'Needs Revision' },
    { id: 'M-2', topic: 'Electromagnetism', wrongAttempts: 2, lastAttempt: '06 Nov', status: 'Needs Revision' },
  ];

  return (
    <div className="card page-stack">
      <div className="section-header"><h3>Mistake Notebook</h3></div>
      <table>
        <thead><tr><th>Topic</th><th>Wrong Attempts</th><th>Last Attempt</th><th>Status</th></tr></thead>
        <tbody>
          {mistakes.map((mistake) => (
            <tr key={mistake.id}><td>{mistake.topic}</td><td>{mistake.wrongAttempts}</td><td>{mistake.lastAttempt}</td><td>{mistake.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookmarksPage({ bookmarks, setBookmarks, questions }) {
  const [note, setNote] = useState('');

  const addBookmark = () => {
    const question = questions[0];
    if (!question) return;
    setBookmarks((current) => [...current, { id: Date.now(), questionId: question.id, note }]);
    toast.success('Bookmark added');
  };

  return (
    <div className="page-stack">
      <div className="card toolbar">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add custom note" />
        <button type="button" className="primary-btn" onClick={addBookmark}>Add Bookmark</button>
      </div>
      <div className="card">
        <div className="section-header"><h3>Bookmarks</h3></div>
        <ul className="bullet-list">
          {bookmarks.length ? bookmarks.map((item) => <li key={item.id}>{item.questionId} — {item.note || 'No note added'}</li>) : <li>No bookmarks yet.</li>}
        </ul>
      </div>
    </div>
  );
}

function FlashcardsPage({ cards, setCards }) {
  const [flipped, setFlipped] = useState({});
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const addCard = () => {
    if (!front || !back) return;
    setCards((current) => [{ id: Date.now(), front, back, subject: 'General Knowledge' }, ...current]);
    setFront('');
    setBack('');
    toast.success('Flashcard created');
  };

  return (
    <div className="page-stack">
      <div className="card toolbar">
        <input placeholder="Front" value={front} onChange={(e) => setFront(e.target.value)} />
        <input placeholder="Back" value={back} onChange={(e) => setBack(e.target.value)} />
        <button type="button" className="primary-btn" onClick={addCard}>Add Card</button>
      </div>
      <div className="flashcard-grid">
        {cards.map((card) => (
          <button key={card.id} type="button" className="flashcard card" onClick={() => setFlipped((current) => ({ ...current, [card.id]: !current[card.id] }))}>
            <div className="flashcard-inner">
              <span className="tag">{card.subject}</span>
              <strong>{flipped[card.id] ? card.back : card.front}</strong>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RevisionPage() {
  const [filter, setFilter] = useState('All dates');
  const [completedIds, setCompletedIds] = useState(() => readStorage('smart-cbt-revision-completed', []));
  const schedule = useMemo(() => {
    const revisionSets = [
      { title: 'Integration techniques', subject: 'Mathematics', topic: 'Calculus', duration: 35, questions: 12 },
      { title: 'Motion and equations', subject: 'Physics', topic: 'Motion', duration: 25, questions: 10 },
      { title: 'Chemical bonding recap', subject: 'Chemistry', topic: 'Chemical Bonding', duration: 30, questions: 12 },
      { title: 'Cell structure review', subject: 'Biology', topic: 'Cell Biology', duration: 25, questions: 10 },
      { title: 'Core data structures', subject: 'Computer Science', topic: 'Data Structures', duration: 30, questions: 12 },
      { title: 'Reading comprehension', subject: 'English', topic: 'Comprehension', duration: 20, questions: 1 },
      { title: 'Number series practice', subject: 'Logical Reasoning', topic: 'Series', duration: 20, questions: 15 },
      { title: 'Coordinate geometry', subject: 'Mathematics', topic: 'Geometry', duration: 35, questions: 12 },
      { title: 'Electricity and circuits', subject: 'Physics', topic: 'Electricity', duration: 30, questions: 10 },
      { title: 'Mole concept drills', subject: 'Chemistry', topic: 'Mole Concept', duration: 25, questions: 12 },
      { title: 'Genetics quick review', subject: 'Biology', topic: 'Genetics', duration: 30, questions: 10 },
      { title: 'Algorithm complexity', subject: 'Computer Science', topic: 'Algorithms', duration: 25, questions: 8 },
      { title: 'Vocabulary in context', subject: 'English', topic: 'Vocabulary', duration: 20, questions: 20 },
      { title: 'Maps and physical geography', subject: 'General Knowledge', topic: 'Geography', duration: 25, questions: 15 },
      { title: 'Probability mixed set', subject: 'Mathematics', topic: 'Probability', duration: 30, questions: 12 },
      { title: 'Work, energy and power', subject: 'Physics', topic: 'Work and Energy', duration: 30, questions: 10 },
      { title: 'Organic reaction review', subject: 'Chemistry', topic: 'Organic Chemistry', duration: 35, questions: 12 },
      { title: 'Human physiology check-in', subject: 'Biology', topic: 'Human Physiology', duration: 30, questions: 10 },
      { title: 'SQL foundations', subject: 'Computer Science', topic: 'Databases', duration: 25, questions: 10 },
      { title: 'Grammar and sentence structure', subject: 'English', topic: 'Grammar', duration: 20, questions: 15 },
      { title: 'Analytical reasoning set', subject: 'Logical Reasoning', topic: 'Analytical Reasoning', duration: 25, questions: 12 },
    ];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    return Array.from({ length: 21 }, (_, index) => {
      const offset = index - 3;
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      return {
        ...revisionSets[index],
        id: `revision-${isoDate}`,
        date,
        isoDate,
        dayOffset: offset,
      };
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('smart-cbt-revision-completed', JSON.stringify(completedIds));
  }, [completedIds]);

  const todayKey = schedule.find((item) => item.dayOffset === 0)?.isoDate;
  const statusFor = (task) => {
    if (completedIds.includes(task.isoDate)) return 'Completed';
    if (task.dayOffset === 0) return 'Due today';
    if (task.dayOffset < 0) return task.dayOffset === -1 ? 'Overdue' : 'Completed';
    return 'Upcoming';
  };
  const visibleSchedule = schedule.filter((task) => {
    const status = statusFor(task);
    if (filter === 'Due & overdue') return status === 'Due today' || status === 'Overdue';
    if (filter === 'Upcoming') return status === 'Upcoming';
    if (filter === 'Completed') return status === 'Completed';
    return true;
  });
  const upcomingCount = schedule.filter((task) => task.dayOffset >= 0 && !completedIds.includes(task.isoDate)).length;
  const doneCount = schedule.filter((task) => statusFor(task) === 'Completed').length;
  const overdueCount = schedule.filter((task) => statusFor(task) === 'Overdue').length;

  return (
    <div className="page-stack revision-page">
      <section className="revision-hero">
        <div className="revision-hero-copy">
          <span className="revision-kicker"><CalendarDays size={14} /> 21-DAY REVISION PLAN</span>
          <h2>Small reviews. Lasting recall.</h2>
          <p>A dated, sample revision schedule across your core subjects. Mark sessions complete as you work through them.</p>
        </div>
        <div className="revision-today">
          <span>TODAY</span>
          <strong>{todayKey && new Date(`${todayKey}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
          <small>{upcomingCount} sessions left in this plan</small>
        </div>
      </section>

      <div className="revision-summary">
        <div className="revision-summary-card">
          <span>Due & overdue</span>
          <strong>{schedule.filter((task) => ['Due today', 'Overdue'].includes(statusFor(task))).length}</strong>
          <small>Ready for a review session</small>
        </div>
        <div className="revision-summary-card">
          <span>Upcoming</span>
          <strong>{upcomingCount}</strong>
          <small>Scheduled through the next 3 weeks</small>
        </div>
        <div className="revision-summary-card">
          <span>Completed</span>
          <strong>{doneCount}</strong>
          <small>Past sample sessions + your check-offs</small>
        </div>
        <div className="revision-summary-card">
          <span>Overdue</span>
          <strong>{overdueCount}</strong>
          <small>Catch up when you have time</small>
        </div>
      </div>

      <section className="card revision-schedule-card">
        <div className="section-header revision-schedule-header">
          <div>
            <h3>Revision calendar</h3>
            <p className="chart-caption">Sample dates are based on your device’s local date.</p>
          </div>
          <select aria-label="Filter revision sessions" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All dates</option>
            <option>Due & overdue</option>
            <option>Upcoming</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="revision-list">
          {visibleSchedule.map((task) => {
            const status = statusFor(task);
            return (
              <article className={`revision-row ${task.dayOffset === 0 ? 'is-today' : ''}`} key={task.id}>
                <div className="revision-date">
                  <strong>{task.date.toLocaleDateString(undefined, { day: '2-digit' })}</strong>
                  <span>{task.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short' })}</span>
                </div>
                <div className="revision-task">
                  <div className="revision-task-title">
                    <strong>{task.title}</strong>
                    <span className={`revision-status ${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
                  </div>
                  <p>{task.subject} <span>·</span> {task.topic}</p>
                  <div className="revision-meta">
                    <span><Clock3 size={13} /> {task.duration} min</span>
                    <span><CheckCircle2 size={13} /> {task.questions} {task.questions === 1 ? 'set' : 'questions'}</span>
                  </div>
                </div>
                {status === 'Completed' ? (
                  <span className="revision-done"><Check size={15} /> Done</span>
                ) : (
                  <button
                    className={status === 'Due today' || status === 'Overdue' ? 'primary-btn revision-action' : 'ghost-btn revision-action'}
                    type="button"
                    onClick={() => {
                      setCompletedIds((current) => current.includes(task.isoDate)
                        ? current.filter((date) => date !== task.isoDate)
                        : [...current, task.isoDate]);
                      toast.success('Revision status updated');
                    }}
                  >
                    Mark complete
                  </button>
                )}
              </article>
            );
          })}
          {visibleSchedule.length === 0 && <p className="revision-empty">No sessions match this filter.</p>}
        </div>
        <p className="revision-note">Schedule dates and task suggestions are sample content. Your completion check-offs are saved on this device.</p>
      </section>
    </div>
  );
}

function StudyPlannerPage({ plans, setPlans }) {
  const [title, setTitle] = useState('');

  const addPlan = () => {
    if (!title.trim()) return;
    setPlans((current) => [...current, { id: Date.now(), title, goal: 'New target', subject: 'Mathematics', status: 'pending' }]);
    setTitle('');
    toast.success('Study goal added');
  };

  return (
    <div className="page-stack">
      <div className="card toolbar">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add study goal" />
        <button type="button" className="primary-btn" onClick={addPlan}>Add Task</button>
      </div>
      <div className="card">
        <div className="section-header"><h3>Study Planner</h3></div>
        <ul className="bullet-list">
          {plans.map((plan) => <li key={plan.id}>{plan.title} — {plan.subject} — {plan.status}</li>)}
        </ul>
      </div>
    </div>
  );
}

function NotificationsPage({ items, setItems }) {
  const markRead = (id) => setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));

  return (
    <div className="card page-stack">
      <div className="section-header"><h3>Notifications</h3></div>
      <div className="list-stack">
        {items.map((item) => (
          <div key={item.id} className="notification-row">
            <div>
              <strong>{item.title}</strong>
              <small>{item.message}</small>
            </div>
            {!item.read && <button type="button" className="ghost-btn small" onClick={() => markRead(item.id)}>Mark as read</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BackupPage() {
  const exportBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      data: {
        questions: readStorage('smart-cbt-questions', []),
        results: readStorage('smart-cbt-results', []),
      },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-cbt-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exported');
  };

  return (
    <div className="page-stack">
      <div className="card">
        <div className="section-header"><h3>Backup and Restore</h3></div>
        <div className="action-row">
          <button type="button" className="primary-btn" onClick={exportBackup}>Export Backup</button>
          <button type="button" className="ghost-btn">Import Backup</button>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="card page-stack form-card">
      <div className="section-header"><h3>Settings</h3></div>
      <div className="form-grid">
        <label>Theme<select><option>Light</option><option>Dark</option><option>System</option></select></label>
        <label>Language<select><option>English</option><option>Hindi</option></select></label>
        <label>Question Font Size<select><option>Normal</option><option>Large</option><option>Extra Large</option></select></label>
        <label>Default Exam Duration<input type="number" defaultValue={60} /></label>
      </div>
    </div>
  );
}

function HelpPage() {
  return (
    <div className="card page-stack">
      <div className="section-header"><h3>Help & Documentation</h3></div>
      <ul className="bullet-list">
        <li>Right Arrow: Next question</li>
        <li>Left Arrow: Previous question</li>
        <li>M: Mark for review</li>
        <li>C: Clear response</li>
        <li>S: Save and next</li>
        <li>P: Previous question</li>
      </ul>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDuration(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default App;
