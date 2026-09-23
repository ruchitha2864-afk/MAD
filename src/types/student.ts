export interface EnrolledCourse {
  code: string;
  name: string;
  credits: number;
  grade: string;
  instructor: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  course: string;
  degree: string;
  department: string;
  semester: string;
  photoUrl: string;
  gpa: number;
  completedCredits: number;
  totalCredits: number;
  attendanceRate: number;
  email: string;
  phone: string;
  status: 'Active' | 'Dean\'s List' | 'Honor Roll';
  advisor: string;
  enrolledCourses: EnrolledCourse[];
}

export const defaultStudent: StudentProfile = {
  id: "STU-2024-8842",
  name: "Samantha Vance",
  course: "B.Sc. Computer Science & Software Engineering",
  degree: "Bachelor of Science",
  department: "Department of Computing and Information Sciences",
  semester: "Year 3 • Semester 5",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
  gpa: 3.89,
  completedCredits: 84,
  totalCredits: 120,
  attendanceRate: 96.5,
  email: "samantha.vance@university.edu",
  phone: "+1 (555) 234-8921",
  status: "Dean's List",
  advisor: "Dr. Robert Vance, PhD",
  enrolledCourses: [
    { code: "CS-301", name: "Data Structures & Algorithms II", credits: 4, grade: "A", instructor: "Dr. Mitchell" },
    { code: "CS-340", name: "Mobile Application Dev (Flutter)", credits: 3, grade: "A+", instructor: "Prof. Zhang" },
    { code: "CS-380", name: "Cloud Architecture & Distributed Systems", credits: 4, grade: "A-", instructor: "Dr. Reynolds" },
    { code: "MATH-240", name: "Discrete Mathematics & Automata", credits: 3, grade: "A", instructor: "Prof. Thorne" }
  ]
};

export const avatarPresets = [
  {
    name: "Samantha Vance",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    course: "B.Sc. Computer Science & Software Engineering"
  },
  {
    name: "Alex Rivera",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
    course: "B.Tech. Artificial Intelligence & Robotics"
  },
  {
    name: "Priya Sharma",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    course: "B.Eng. Electrical & Mechatronics"
  },
  {
    name: "Marcus Alexander Chen",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    course: "B.S. Cybersecurity & Information Assurance"
  },
  {
    name: "Zara Al-Mansoor",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    course: "B.Sc. Data Science & Machine Learning"
  },
  {
    name: "Jordan Lee",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    course: "B.Sc. Software Engineering"
  },
  {
    name: "Elena Rostova",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
    course: "B.Des. Human-Computer Interaction"
  },
  {
    name: "Tariq Edwards",
    url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80",
    course: "B.Sc. Cloud Computing & Networks"
  }
];
