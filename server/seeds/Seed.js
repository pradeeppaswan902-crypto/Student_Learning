import mongoose from "mongoose";
console.log("SEED FILE STARTED");
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Assignment from "../models/assignmentModel.js";
import Quiz from "../models/quizModel.js";
import Attendance from "../models/attendanceModel.js";
import Job from "../models/jobModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const seedUsers = [
  { name: "Rahul", email: "rahul@gmail.com", password: "123456" },
  { name: "John Doe", email: "student@example.com", password: "password123" },
];

const seedCourses = [
  {
    name: "Introduction to React",
    instructor: "Dr. Sarah Johnson",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    modules: [
      {
        name: "Getting Started with React",
        lessons: [
          {
            title: "What is React?",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
            notes: "React is a JavaScript library for building user interfaces.",
            quiz: null,
            codeLab: "Create a simple Hello World component",
          },
          {
            title: "Setting up Development Environment",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=4zDeHk5gKMA",
            notes: "Install Node.js, npm, and create a new React app.",
            quiz: null,
          },
          {
            title: "Your First React Component",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=Y6aYx_KKM7Q",
            notes: "Learn how to create and render React components.",
            quiz: null,
            codeLab: "Build a counter component",
          },
        ],
      },
      {
        name: "Components and Props",
        lessons: [
          {
            title: "Understanding Components",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=J3TQW-ZaXHc",
            notes: "Deep dive into React components and their lifecycle.",
            quiz: null,
          },
          {
            title: "Working with Props",
            difficulty: "Intermediate",
            videoUrl: "https://www.youtube.com/watch?v=m7OWXtBIkZY",
            notes: "Learn how to pass data to components using props.",
            quiz: null,
            codeLab: "Create a reusable Card component",
          },
        ],
      },
      {
        name: "State Management",
        lessons: [
          {
            title: "Introduction to State",
            difficulty: "Intermediate",
            videoUrl: "https://www.youtube.com/watch?v=4ORZ1GmjaMc",
            notes: "Understanding state in React applications.",
            quiz: null,
          },
          {
            title: "useState Hook",
            difficulty: "Intermediate",
            videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0",
            notes: "Learn how to manage state with useState hook.",
            quiz: null,
            codeLab: "Build a todo list with state management",
          },
        ],
      },
    ],
  },
  {
    name: "JavaScript Fundamentals",
    instructor: "Prof. Michael Chen",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
    modules: [
      {
        name: "Basic Concepts",
        lessons: [
          {
            title: "Variables and Data Types",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
            notes: "Learn about var, let, const and JavaScript data types.",
            quiz: null,
          },
          {
            title: "Functions",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=FOD408aJvho",
            notes: "Understanding function declarations and expressions.",
            quiz: null,
            codeLab: "Write various function examples",
          },
        ],
      },
      {
        name: "Advanced Topics",
        lessons: [
          {
            title: "Asynchronous JavaScript",
            difficulty: "Intermediate",
            videoUrl: "https://www.youtube.com/watch?v=ZvbzSrg0afE",
            notes: "Promises, async/await, and callbacks.",
            quiz: null,
          },
          {
            title: "ES6+ Features",
            difficulty: "Intermediate",
            videoUrl: "https://www.youtube.com/watch?v=NCwa_xi0Uuc",
            notes: "Arrow functions, destructuring, spread operator.",
            quiz: null,
            codeLab: "Refactor code using modern JavaScript features",
          },
        ],
      },
    ],
  },
  {
    name: "Python for Data Science",
    instructor: "Dr. Emily Rodriguez",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
    modules: [
      {
        name: "Python Basics",
        lessons: [
          {
            title: "Introduction to Python",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            notes: "Python syntax, variables, and basic operations.",
            quiz: null,
          },
          {
            title: "Data Structures",
            difficulty: "Beginner",
            videoUrl: "https://www.youtube.com/watch?v=W8KRzm-HUcc",
            notes: "Lists, tuples, dictionaries, and sets.",
            quiz: null,
            codeLab: "Implement various data structures",
          },
        ],
      },
      {
        name: "Data Analysis with Pandas",
        lessons: [
          {
            title: "Pandas DataFrames",
            difficulty: "Intermediate",
            videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
            notes: "Working with tabular data using pandas.",
            quiz: null,
          },
          {
            title: "Data Visualization",
            difficulty: "Intermediate",
            videoUrl: "https://www.youtube.com/watch?v=3Xc3CA656Y4",
            notes: "Creating charts and graphs with matplotlib.",
            quiz: null,
            codeLab: "Analyze a dataset and create visualizations",
          },
        ],
      },
    ],
  },
{
  name: "Node.js Backend Development",
  instructor: "Mr. David Wilson",
  thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
  modules: [
    {
      name: "Node.js Basics",
      lessons: [
        {
          title: "Introduction to Node.js",
          difficulty: "Beginner",
          videoUrl: "https://www.youtube.com/watch?v=ENrzD9HAZK4",
          notes: "Understand Node.js runtime, event loop, and basic setup.",
          quiz: null,
        },
        {
          title: "Modules and npm",
          difficulty: "Beginner",
          videoUrl: "https://www.youtube.com/watch?v=2LUdnb-mls0",
          notes: "Learn CommonJS, ES Modules, and package management with npm.",
          quiz: null,
          codeLab: "Create and publish a simple npm package",
        },
      ],
    },
    {
      name: "Express.js Fundamentals",
      lessons: [
        {
          title: "Building REST APIs",
          difficulty: "Intermediate",
          videoUrl: "https://www.youtube.com/watch?v=l8WPWK9mS5M",
          notes: "Create RESTful APIs using Express.js.",
          quiz: null,
        },
        {
          title: "Middleware in Express",
          difficulty: "Intermediate",
          videoUrl: "https://www.youtube.com/watch?v=lY6icfhap2o",
          notes: "Understand middleware functions and request handling.",
          quiz: null,
          codeLab: "Build authentication middleware",
        },
      ],
    },
  ],
},
{
  name: "MongoDB Database Management",
  instructor: "Ms. Lisa Anderson",
  thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
  modules: [
    {
      name: "MongoDB Basics",
      lessons: [
        {
          title: "Introduction to MongoDB",
          difficulty: "Beginner",
          videoUrl: "https://www.youtube.com/watch?v=2QQGWYe7IDU",
          notes: "Learn NoSQL concepts and MongoDB fundamentals.",
          quiz: null,
        },
        {
          title: "CRUD Operations",
          difficulty: "Beginner",
          videoUrl: "https://www.youtube.com/watch?v=excRb9yF-Ko",
          notes: "Create, Read, Update, and Delete operations in MongoDB.",
          quiz: null,
          codeLab: "Perform CRUD operations using Mongo Shell",
        },
      ],
    },
    {
      name: "Mongoose Integration",
      lessons: [
        {
          title: "Using Mongoose with Node.js",
          difficulty: "Intermediate",
          videoUrl: "https://www.youtube.com/watch?v=WDrU305J1yw",
          notes: "Schema creation and model relationships using Mongoose.",
          quiz: null,
        },
        {
          title: "Population and Validation",
          difficulty: "Intermediate",
          videoUrl: "https://www.youtube.com/watch?v=2jqok-WgelI",
          notes: "Learn document population and schema validation.",
          quiz: null,
          codeLab: "Create relational models using Mongoose",
        },
      ],
    },
  ],
},
{
  name: "UI/UX Design Fundamentals",
  instructor: "Mrs. Sophia Martinez",
  thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
  modules: [
    {
      name: "Design Principles",
      lessons: [
        {
          title: "Introduction to UI/UX",
          difficulty: "Beginner",
          videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
          notes: "Understand the difference between UI and UX design.",
          quiz: null,
        },
        {
          title: "Color Theory and Typography",
          difficulty: "Beginner",
          videoUrl: "https://www.youtube.com/watch?v=_2LLXnUdUIc",
          notes: "Learn how colors and fonts impact user experience.",
          quiz: null,
          codeLab: "Design a landing page wireframe",
        },
      ],
    },
    {
      name: "Wireframing and Prototyping",
      lessons: [
        {
          title: "Creating Wireframes",
          difficulty: "Intermediate",
          videoUrl: "https://www.youtube.com/watch?v=qpH7-KFWZRI",
          notes: "Build low-fidelity wireframes for web applications.",
          quiz: null,
        },
        {
          title: "Interactive Prototypes",
          difficulty: "Intermediate",
          videoUrl: "https://www.youtube.com/watch?v=4Ww1F6Y6Hfc",
          notes: "Learn prototyping tools like Figma and Adobe XD.",
          quiz: null,
          codeLab: "Create a mobile app prototype",
        },
      ],
    },
  ],
}


];

const seedAssignments = [
  {
    title: "React Component Development",
    description: "Create a reusable React component that displays user information with proper props validation and state management. Include features like editing user details and form validation.",
    field: "Web Development",
    details: "This assignment focuses on building interactive user interfaces using React. Students will learn component composition, props handling, and state management patterns.",
    deadline: new Date(2026, 3, 30), // April 30, 2026
    submissionTypes: ["file", "text", "link"],
    submissions: [
      {
        student: null, // Will be set after users are created
        submissionType: "text",
        content: "I created a UserCard component with props validation using PropTypes. The component includes state management for editing user details and form validation for email and phone number fields.",
        submittedAt: new Date(2026, 3, 28),
        isLate: false,
        status: "evaluated",
        marks: 85,
        feedback: "Excellent work! Your component demonstrates good understanding of React props and state management. The form validation is well implemented. Consider adding more comprehensive error handling for edge cases.",
        evaluatedAt: new Date(2026, 3, 29),
      }
    ],
  },
  {
    title: "JavaScript Algorithm Implementation",
    description: "Implement common algorithms in JavaScript: bubble sort, quick sort, binary search, and a recursive factorial function. Include time complexity analysis and test cases.",
    field: "Software Engineering",
    details: "This assignment covers fundamental algorithm implementation and analysis. Students will learn sorting algorithms, search techniques, and recursive programming patterns in JavaScript.",
    deadline: new Date(2026, 4, 5), // May 5, 2026
    submissionTypes: ["file", "link"],
    submissions: [],
  },
  {
    title: "Python Data Analysis Project",
    description: "Using Python and pandas, analyze a dataset of your choice. Create visualizations using matplotlib and provide insights from the data. Submit your code and a brief report.",
    field: "Data Science",
    details: "This project introduces students to data analysis workflows using Python. Students will learn data cleaning, statistical analysis, and visualization techniques.",
    deadline: new Date(2026, 4, 10), // May 10, 2026
    submissionTypes: ["file", "text"],
    submissions: [],
  },
  {
    title: "Database Design Assignment",
    description: "Design a database schema for a student management system. Include ER diagrams, table schemas, and sample queries. Consider normalization and relationships.",
    field: "Database",
    details: "This assignment covers database design principles including entity-relationship modeling, normalization, and SQL query writing for a comprehensive student management system.",
    deadline: new Date(2026, 3, 25), // April 25, 2026 (past deadline for demo)
    submissionTypes: ["file", "link"],
    submissions: [
      {
        student: null, // Will be set after users are created
        submissionType: "link",
        content: "https://github.com/student/database-design-schema",
        submittedAt: new Date(2026, 3, 26),
        isLate: true,
        status: "evaluated",
        marks: 78,
        feedback: "Good work on the database schema design. Your ER diagram is clear and the normalization is correct. However, some relationships could be better optimized. Late submission noted.",
        evaluatedAt: new Date(2026, 3, 27),
      }
    ],
  },
];

const seedQuizzes = [
  {
    title: "React Fundamentals Quiz",
    duration: 15, // 15 minutes
    totalQuestions: 5,
    questions: [
      {
        question: "What is JSX?",
        type: "single",
        options: [
          "A JavaScript framework",
          "A syntax extension for JavaScript",
          "A CSS preprocessor",
          "A database query language"
        ],
        correctAnswers: [1],
        explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files."
      },
      {
        question: "Which hook is used to manage state in functional components?",
        type: "single",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswers: [1],
        explanation: "useState is the hook used to add state to functional components in React."
      },
      {
        question: "What are the correct ways to pass data to a component? (Select all that apply)",
        type: "multiple",
        options: ["Props", "State", "Context", "Local variables"],
        correctAnswers: [0, 2],
        explanation: "Props and Context are the correct ways to pass data to components. State is internal to the component, and local variables don't persist across renders."
      },
      {
        question: "What does the useEffect hook do?",
        type: "single",
        options: [
          "Manages component state",
          "Handles side effects in components",
          "Creates context providers",
          "Optimizes component rendering"
        ],
        correctAnswers: [1],
        explanation: "useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM."
      },
      {
        question: "Which of the following are valid React element types?",
        type: "multiple",
        options: ["Strings", "Numbers", "Arrays", "Objects"],
        correctAnswers: [0, 1],
        explanation: "React elements can be strings or numbers. Arrays and objects need to be converted to valid React elements."
      }
    ]
  },
  {
    title: "JavaScript Basics Quiz",
    duration: 20,
    totalQuestions: 6,
    questions: [
      {
        question: "What is the difference between let and var?",
        type: "single",
        options: [
          "let is block-scoped, var is function-scoped",
          "var is block-scoped, let is function-scoped",
          "They are exactly the same",
          "let is for constants, var is for variables"
        ],
        correctAnswers: [0],
        explanation: "let is block-scoped while var is function-scoped, which can lead to hoisting issues."
      },
      {
        question: "What will console.log(typeof null) output?",
        type: "single",
        options: ["null", "undefined", "object", "boolean"],
        correctAnswers: [2],
        explanation: "This is a well-known quirk in JavaScript where typeof null returns 'object'."
      },
      {
        question: "Which of these are primitive data types in JavaScript?",
        type: "multiple",
        options: ["string", "number", "boolean", "object", "array"],
        correctAnswers: [0, 1, 2],
        explanation: "string, number, and boolean are primitive types. object and array are reference types."
      },
      {
        question: "What does the '===' operator do?",
        type: "single",
        options: [
          "Assigns a value",
          "Compares values and types",
          "Compares only values",
          "Creates a new variable"
        ],
        correctAnswers: [1],
        explanation: "The strict equality operator (===) compares both value and type, unlike == which does type coercion."
      },
      {
        question: "What is a closure in JavaScript?",
        type: "single",
        options: [
          "A way to close browser windows",
          "A function that has access to variables in its outer scope",
          "A method to end loops",
          "A type of error handling"
        ],
        correctAnswers: [1],
        explanation: "A closure is a function that remembers and has access to variables from its lexical scope even when executed outside that scope."
      },
      {
        question: "What is the purpose of async/await?",
        type: "single",
        options: [
          "To make code run faster",
          "To handle asynchronous operations more elegantly",
          "To create loops",
          "To define classes"
        ],
        correctAnswers: [1],
        explanation: "async/await provides a more readable way to handle asynchronous operations compared to promises with .then() chains."
      }
    ]
  },
  {
    title: "Python Data Types Quiz",
    duration: 12,
    totalQuestions: 4,
    questions: [
      {
        question: "Which of these are immutable data types in Python?",
        type: "multiple",
        options: ["list", "tuple", "dictionary", "string", "set"],
        correctAnswers: [1, 3],
        explanation: "Tuples and strings are immutable in Python. Lists, dictionaries, and sets are mutable."
      },
      {
        question: "What is the correct way to create a dictionary in Python?",
        type: "single",
        options: [
          "dict = {key: value}",
          "dict = [key, value]",
          "dict = (key, value)",
          "dict = <key, value>"
        ],
        correctAnswers: [0],
        explanation: "Dictionaries in Python use curly braces {} with key-value pairs separated by colons."
      },
      {
        question: "What does the len() function return for a string?",
        type: "single",
        options: [
          "The number of characters",
          "The number of words",
          "The memory size",
          "The ASCII values"
        ],
        correctAnswers: [0],
        explanation: "len() returns the number of characters in a string, including spaces and punctuation."
      },
      {
        question: "Which statement about Python lists is correct?",
        type: "single",
        options: [
          "Lists can only contain one data type",
          "Lists are immutable",
          "Lists can contain mixed data types",
          "Lists cannot be nested"
        ],
        correctAnswers: [2],
        explanation: "Python lists can contain elements of different data types and can be nested."
      }
    ]
  },
  {
    title: "Web Development Fundamentals",
    duration: 18,
    totalQuestions: 5,
    questions: [
      {
        question: "What does HTML stand for?",
        type: "single",
        options: [
          "HyperText Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language"
        ],
        correctAnswers: [0],
        explanation: "HTML stands for HyperText Markup Language, the standard markup language for creating web pages."
      },
      {
        question: "Which of these are valid CSS selectors?",
        type: "multiple",
        options: [".class", "#id", "element", "@media"],
        correctAnswers: [0, 1, 2],
        explanation: ".class, #id, and element are valid CSS selectors. @media is an at-rule, not a selector."
      },
      {
        question: "What is the purpose of the alt attribute in an img tag?",
        type: "single",
        options: [
          "To style the image",
          "To provide alternative text for screen readers",
          "To set image dimensions",
          "To link to another page"
        ],
        correctAnswers: [1],
        explanation: "The alt attribute provides alternative text that describes the image, important for accessibility and when images fail to load."
      },
      {
        question: "What does the CSS property 'display: flex' do?",
        type: "single",
        options: [
          "Makes elements float",
          "Creates a flexible layout container",
          "Hides elements",
          "Changes text color"
        ],
        correctAnswers: [1],
        explanation: "display: flex creates a flex container, enabling flexbox layout for its children."
      },
      {
        question: "Which HTTP status code indicates a successful response?",
        type: "single",
        options: ["200", "300", "400", "500"],
        correctAnswers: [0],
        explanation: "HTTP status code 200 indicates a successful response from the server."
      }
    ]
  },
  {
    title: "Database Concepts Quiz",
    duration: 25,
    totalQuestions: 5,
    questions: [
      {
        question: "What does SQL stand for?",
        type: "single",
        options: [
          "Simple Query Language",
          "Structured Query Language",
          "System Query Language",
          "Standard Query Language"
        ],
        correctAnswers: [1],
        explanation: "SQL stands for Structured Query Language, used for managing relational databases."
      },
      {
        question: "Which of these are types of database relationships?",
        type: "multiple",
        options: ["One-to-One", "One-to-Many", "Many-to-One", "Many-to-Many"],
        correctAnswers: [0, 1, 2, 3],
        explanation: "All of these are valid types of relationships in relational databases."
      },
      {
        question: "What is normalization in databases?",
        type: "single",
        options: [
          "Making data smaller",
          "Organizing data to reduce redundancy",
          "Encrypting data",
          "Backing up data"
        ],
        correctAnswers: [1],
        explanation: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity."
      },
      {
        question: "What is a primary key?",
        type: "single",
        options: [
          "The main door to the database",
          "A unique identifier for each record",
          "The password for the database",
          "The first column in a table"
        ],
        correctAnswers: [1],
        explanation: "A primary key is a unique identifier for each record in a database table."
      },
      {
        question: "What does ACID stand for in database transactions?",
        type: "multiple",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        correctAnswers: [0, 1, 2, 3],
        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability - properties that guarantee reliable database transactions."
      }
    ]
  }
];

// Seed attendance sessions for every course so dashboard shows data everywhere.
// We assign the same template sessions to each course (dates are offset by course index).
const attendanceTemplatesByCourse = [
  // React → High attendance (~90%)
  [
    { dayOffset: 0, status: "present", sessionType: "lecture" },
    { dayOffset: 2, status: "present", sessionType: "lab" },
    { dayOffset: 4, status: "present", sessionType: "tutorial" },
    { dayOffset: 6, status: "late", sessionType: "lecture" },
    { dayOffset: 8, status: "present", sessionType: "lab" },
  ],

  // JavaScript → Medium attendance (~75%)
  [
    { dayOffset: 0, status: "present", sessionType: "lecture" },
    { dayOffset: 2, status: "absent", sessionType: "lab" },
    { dayOffset: 4, status: "present", sessionType: "tutorial" },
    { dayOffset: 6, status: "late", sessionType: "lecture" },
    { dayOffset: 8, status: "absent", sessionType: "lab" },
  ],

  // Python → Lower attendance (~60%)
  [
    { dayOffset: 0, status: "present", sessionType: "lecture" },
    { dayOffset: 2, status: "absent", sessionType: "lab" },
    { dayOffset: 4, status: "absent", sessionType: "tutorial" },
    { dayOffset: 6, status: "late", sessionType: "lecture" },
    { dayOffset: 8, status: "present", sessionType: "lab" },
  ],

  // Node.js → Strong attendance
  [
    { dayOffset: 0, status: "present", sessionType: "lecture" },
    { dayOffset: 2, status: "present", sessionType: "lab" },
    { dayOffset: 4, status: "present", sessionType: "tutorial" },
    { dayOffset: 6, status: "present", sessionType: "lecture" },
    { dayOffset: 8, status: "late", sessionType: "lab" },
  ],

  // MongoDB → Average
  [
    { dayOffset: 0, status: "present", sessionType: "lecture" },
    { dayOffset: 2, status: "absent", sessionType: "lab" },
    { dayOffset: 4, status: "present", sessionType: "tutorial" },
    { dayOffset: 6, status: "present", sessionType: "lecture" },
    { dayOffset: 8, status: "late", sessionType: "lab" },
  ],

  // UI/UX → Very good
  [
    { dayOffset: 0, status: "present", sessionType: "lecture" },
    { dayOffset: 2, status: "present", sessionType: "lab" },
    { dayOffset: 4, status: "present", sessionType: "tutorial" },
    { dayOffset: 6, status: "present", sessionType: "lecture" },
    { dayOffset: 8, status: "present", sessionType: "lab" },
  ],
];

const seedJobs = [
  {
    field: 'Software Engineering',
    details: 'Develop and maintain web applications using modern technologies. Work with React, Node.js, and cloud services.',
    companyName: 'TechCorp Inc.',
    role: 'Frontend Developer Intern',
    requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML'],
    applicationLink: 'https://example.com/apply/frontend-intern',
    type: 'internship'
  },
  {
    field: 'Data Science',
    details: 'Analyze large datasets and build predictive models. Work with machine learning algorithms and data visualization.',
    companyName: 'DataAnalytics Ltd.',
    role: 'Data Analyst',
    requiredSkills: ['Python', 'Pandas', 'SQL', 'Machine Learning'],
    applicationLink: 'https://example.com/apply/data-analyst',
    type: 'job'
  },
  {
    field: 'Marketing',
    details: 'Create and execute digital marketing campaigns. Manage social media presence and analyze campaign performance.',
    companyName: 'MarketMasters',
    role: 'Digital Marketing Specialist',
    requiredSkills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    applicationLink: 'https://example.com/apply/digital-marketing',
    type: 'job'
  },
  {
    field: 'Finance',
    details: 'Assist in financial analysis and reporting. Work with financial models and data analysis tools.',
    companyName: 'FinanceFirst Bank',
    role: 'Financial Analyst Intern',
    requiredSkills: ['Excel', 'Financial Modeling', 'Accounting', 'Data Analysis'],
    applicationLink: 'https://example.com/apply/financial-analyst-intern',
    type: 'internship'
  },
  {
    field: 'Design',
    details: 'Create user interfaces and visual designs for products. Work with design tools and user research.',
    companyName: 'CreativeStudio',
    role: 'UX/UI Designer',
    requiredSkills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    applicationLink: 'https://example.com/apply/ux-ui-designer',
    type: 'job'
  },
  {
    field: 'Engineering',
    details: 'Design and develop mechanical systems. Work with CAD software and engineering principles.',
    companyName: 'EngiTech Solutions',
    role: 'Mechanical Engineer',
    requiredSkills: ['CAD', 'SolidWorks', 'Thermodynamics', 'Materials Science'],
    applicationLink: 'https://example.com/apply/mechanical-engineer',
    type: 'job'
  }
];

try {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();
  await Course.deleteMany();
  await Assignment.deleteMany();
  await Quiz.deleteMany();
  await Attendance.deleteMany();
  await Job.deleteMany();

  const hashedUsers = await Promise.all(
    seedUsers.map(async (user) => ({
      name: user.name,
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  const users = await User.insertMany(hashedUsers);
  await Course.insertMany(seedCourses);

  // Set student IDs for assignment submissions
  seedAssignments[0].submissions[0].student = users[0]._id; // First user
  seedAssignments[3].submissions[0].student = users[0]._id; // First user

  await Assignment.insertMany(seedAssignments);
  await Quiz.insertMany(seedQuizzes);
  await Job.insertMany(seedJobs);

  // Seed attendance for all courses for the first user.
  // Each course gets its own attendance pattern; fallback to the first template.
  const courses = await Course.find({});
  const baseDate = new Date(2026, 3, 1); // April 1, 2026

  const attendanceDocs = courses.flatMap((course, courseIndex) => {
    const template =
      attendanceTemplatesByCourse[courseIndex] || attendanceTemplatesByCourse[0];

    return template.map((s) => {
      const sessionDate = new Date(baseDate);
      sessionDate.setDate(sessionDate.getDate() + s.dayOffset + courseIndex);

      return {
        user: users[0]._id,
        course: course._id,
        sessionDate,
        status: s.status,
        sessionType: s.sessionType,
        markedBy: users[0]._id,
      };
    });
  });

  await Attendance.insertMany(attendanceDocs);

  console.log("✅ Seed complete: users, courses, assignments, quizzes, and attendance created.");
} catch (error) {
  console.error("Seed failed:", error);
  process.exit(1);
} finally {
  await mongoose.disconnect();
  process.exit(0);
}