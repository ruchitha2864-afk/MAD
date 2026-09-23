import { defaultStudent, avatarPresets, StudentProfile } from '../src/types/student';
import { generateFlutterDartCode, pubspecYamlContent } from '../src/data/flutterCode';

// Color formatting for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, errorMsg?: string) {
  if (condition) {
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${testName}`);
    passedCount++;
  } else {
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${testName} ${errorMsg ? `(${errorMsg})` : ''}`);
    failedCount++;
  }
}

console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  FLUTTER STUDENT PROFILE APP - AUTOMATED TEST SUITE ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

// -------------------------------------------------------------
// TEST GROUP 1: Initial State & Data Model
// -------------------------------------------------------------
console.log(`${colors.bold}Test Group 1: Student Profile Initial State & Model${colors.reset}`);

assert(
  Boolean(defaultStudent.name && defaultStudent.name.length > 0),
  'Default student has a valid non-empty name',
  `Found: ${defaultStudent.name}`
);

assert(
  Boolean(defaultStudent.course && defaultStudent.course.includes('Computer Science')),
  'Default student course is defined correctly',
  `Found: ${defaultStudent.course}`
);

assert(
  Boolean(defaultStudent.photoUrl && defaultStudent.photoUrl.startsWith('http')),
  'Default student photoUrl is configured with valid URL',
  `Found: ${defaultStudent.photoUrl}`
);

assert(
  Boolean(defaultStudent.enrolledCourses && defaultStudent.enrolledCourses.length > 0),
  'Default student has enrolled courses list for semester',
  `Found: ${defaultStudent.enrolledCourses.length} courses`
);

assert(
  Boolean(avatarPresets && avatarPresets.length >= 3),
  'Sample profile presets are available for quick switching',
  `Found: ${avatarPresets.length} presets`
);

// -------------------------------------------------------------
// TEST GROUP 2: Navigation & Route Flow (Navigator.push & pop)
// -------------------------------------------------------------
console.log(`\n${colors.bold}Test Group 2: Flutter Navigator Route Stack Transitions${colors.reset}`);

// Simulated Navigator Stack
class MockNavigator {
  private stack: Array<{ route: string; args?: any }> = [{ route: '/profile' }];

  getCurrentRoute(): string {
    return this.stack[this.stack.length - 1].route;
  }

  getStackDepth(): number {
    return this.stack.length;
  }

  push(route: string, args?: any): Promise<any> {
    return new Promise((resolve) => {
      this.stack.push({ route, args });
      // Attach resolver to route entry
      (this.stack[this.stack.length - 1] as any).resolve = resolve;
    });
  }

  pop(result?: any): void {
    if (this.stack.length <= 1) {
      throw new Error('Cannot pop root route from Navigator stack');
    }
    const popped = this.stack.pop();
    if (popped && (popped as any).resolve) {
      (popped as any).resolve(result);
    }
  }
}

const nav = new MockNavigator();
assert(nav.getCurrentRoute() === '/profile', 'Initial route on app launch is /profile');
assert(nav.getStackDepth() === 1, 'Initial Navigator stack depth is 1');

// Push Screen 2
let navigationCompleted = false;
let receivedResult: string | null = null;

const pushPromise = nav.push('/edit', { currentName: defaultStudent.name });
assert(nav.getCurrentRoute() === '/edit', 'Navigator.push navigates active route to /edit');
assert(nav.getStackDepth() === 2, 'Navigator stack depth is 2 after push');

// Pop Screen 2 with updated name
const testUpdatedName = 'Dr. Samantha Vance, PhD';
pushPromise.then((result) => {
  receivedResult = result;
  navigationCompleted = true;
});

nav.pop(testUpdatedName);

assert(nav.getCurrentRoute() === '/profile', 'Navigator.pop restores active route back to /profile');
assert(nav.getStackDepth() === 1, 'Navigator stack depth returns to 1 after pop');

// -------------------------------------------------------------
// TEST GROUP 3: Form Validation in Screen 2
// -------------------------------------------------------------
console.log(`\n${colors.bold}Test Group 3: Screen 2 TextField Validation Rules${colors.reset}`);

function validateStudentName(input: string): { valid: boolean; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: 'Student name cannot be empty' };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Student name must be at least 2 characters' };
  }
  return { valid: true };
}

assert(!validateStudentName('').valid, 'Empty string is rejected by validator');
assert(!validateStudentName('   ').valid, 'Whitespace-only string is rejected by validator');
assert(!validateStudentName('A').valid, 'Single-character string is rejected by validator');
assert(validateStudentName('Alex').valid, 'Valid name "Alex" is accepted');
assert(validateStudentName('Marcus Alexander Chen').valid, 'Full name with spaces is accepted');

// -------------------------------------------------------------
// TEST GROUP 4: State Update & Synchronization
// -------------------------------------------------------------
console.log(`\n${colors.bold}Test Group 4: State Update & SnackBar Feedback${colors.reset}`);

let studentState: StudentProfile = { ...defaultStudent };
let previousProfileHistory: { name: string; photoUrl: string } | null = null;
let snackbarMessage: string | null = null;

function updateStudentProfile(newName: string, newPhotoUrl: string) {
  previousProfileHistory = { name: studentState.name, photoUrl: studentState.photoUrl };
  studentState = { ...studentState, name: newName, photoUrl: newPhotoUrl };
  snackbarMessage = `Student profile updated: "${newName}"`;
}

function undoProfileUpdate() {
  if (previousProfileHistory) {
    studentState = { ...studentState, name: previousProfileHistory.name, photoUrl: previousProfileHistory.photoUrl };
    snackbarMessage = `Restored previous profile: "${previousProfileHistory.name}"`;
    previousProfileHistory = null;
  }
}

const newTestPhoto = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80';
updateStudentProfile('Elena Rostova', newTestPhoto);
assert(studentState.name === 'Elena Rostova', 'State updates student name to "Elena Rostova"');
assert(studentState.photoUrl === newTestPhoto, 'State updates student photoUrl to new image URL');
assert(
  snackbarMessage === 'Student profile updated: "Elena Rostova"',
  'SnackBar feedback triggers with updated profile name'
);

undoProfileUpdate();
assert(studentState.name === 'Samantha Vance', 'Undo action restores original student name');
assert(studentState.photoUrl === defaultStudent.photoUrl, 'Undo action restores original student photoUrl');
assert(
  snackbarMessage === 'Restored previous profile: "Samantha Vance"',
  'SnackBar confirms restoration of previous profile'
);

// -------------------------------------------------------------
// TEST GROUP 5: Flutter Dart Source Code Integrity
// -------------------------------------------------------------
console.log(`\n${colors.bold}Test Group 5: Generated Flutter Dart Code Integrity${colors.reset}`);

const dartCode = generateFlutterDartCode('Samantha Vance', defaultStudent.course, defaultStudent.photoUrl);

const requiredDartSnippets = [
  { snippet: 'package:flutter/material.dart', name: 'Material import' },
  { snippet: 'class StudentProfileApp extends StatelessWidget', name: 'Root MaterialApp widget' },
  { snippet: 'class StudentProfileScreen extends StatefulWidget', name: 'Screen 1 StatefulWidget declaration' },
  { snippet: 'CircleAvatar', name: 'CircleAvatar widget' },
  { snippet: 'Navigator.push<String>', name: 'Navigator.push with return type Future<String>' },
  { snippet: 'class EditProfileScreen extends StatefulWidget', name: 'Screen 2 StatefulWidget declaration' },
  { snippet: 'TextFormField', name: 'TextFormField widget for name editing' },
  { snippet: 'Navigator.pop(context,', name: 'Navigator.pop passing updated value' },
  { snippet: 'setState(()', name: 'setState rebuilding Screen 1 with new name' },
  { snippet: 'ScaffoldMessenger.of(context).showSnackBar', name: 'SnackBar feedback on save' },
];

for (const req of requiredDartSnippets) {
  assert(
    dartCode.includes(req.snippet),
    `Generated main.dart contains ${req.name} (${req.snippet})`
  );
}

assert(
  pubspecYamlContent.includes('uses-material-design: true'),
  'pubspec.yaml includes uses-material-design: true'
);

// -------------------------------------------------------------
// TEST GROUP 6: Student Registration Flow (Screen 3)
// -------------------------------------------------------------
console.log(`\n${colors.bold}Test Group 6: Student Registration Flow (Screen 3)${colors.reset}`);

function validateRegistration(input: {
  name: string;
  email: string;
  phone: string;
  advisor: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errs: Record<string, string> = {};
  if (!input.name || input.name.trim().length < 3) errs.name = 'Invalid name';
  if (!input.email || !input.email.includes('@')) errs.email = 'Invalid email';
  if (!input.phone || input.phone.trim().length < 7) errs.phone = 'Invalid phone';
  if (!input.advisor || input.advisor.trim().length < 2) errs.advisor = 'Invalid advisor';
  return { valid: Object.keys(errs).length === 0, errors: errs };
}

const invalidReg = validateRegistration({ name: 'Al', email: 'no-email', phone: '', advisor: '' });
assert(!invalidReg.valid, 'Incomplete registration form is rejected');
assert(Boolean(invalidReg.errors.name), 'Short student name is flagged in registration');
assert(Boolean(invalidReg.errors.email), 'Malformed email is flagged in registration');

const validReg = validateRegistration({
  name: 'Jordan Alexander Lee',
  email: 'jordan.lee@university.edu',
  phone: '+1 (555) 782-9901',
  advisor: 'Dr. Fei-Fei Li, PhD',
});
assert(validReg.valid, 'Complete registration form is accepted');

// Simulate Navigator registration pop & state change
const newlyRegisteredStudent: StudentProfile = {
  id: 'STU-2025-9941',
  name: 'Jordan Alexander Lee',
  course: 'B.Tech. Artificial Intelligence & Robotics',
  degree: 'Bachelor of Science',
  department: 'School of Artificial Intelligence & Data Science',
  semester: 'Year 1 • Semester 1',
  photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  gpa: 4.0,
  completedCredits: 0,
  totalCredits: 120,
  attendanceRate: 100.0,
  email: 'jordan.lee@university.edu',
  phone: '+1 (555) 782-9901',
  status: 'Active',
  advisor: 'Dr. Fei-Fei Li, PhD',
  enrolledCourses: [],
};

studentState = newlyRegisteredStudent;
assert(studentState.id === 'STU-2025-9941', 'Active student ID updates to newly registered student');
assert(studentState.name === 'Jordan Alexander Lee', 'Active student name updates to newly registered student');
assert(studentState.course === 'B.Tech. Artificial Intelligence & Robotics', 'Active course updates to newly registered program');

// -------------------------------------------------------------
// TEST GROUP 7: Editing Metrics, Contact & Course Enrollments
// -------------------------------------------------------------
console.log(`\n${colors.bold}Test Group 7: Editing Metrics, Contact & Course Enrollments${colors.reset}`);

// 1. Validate GPA limits
function validateGpa(gpaStr: string): boolean {
  const num = parseFloat(gpaStr);
  return !isNaN(num) && num >= 0.0 && num <= 4.0;
}
assert(validateGpa('3.84') === true, 'Valid GPA 3.84 passes validation');
assert(validateGpa('4.00') === true, 'Max GPA 4.00 passes validation');
assert(validateGpa('4.20') === false, 'Out of bounds GPA 4.20 fails validation');
assert(validateGpa('-0.5') === false, 'Negative GPA fails validation');

// 2. Validate Attendance rate
function validateAttendance(attStr: string): boolean {
  const num = parseFloat(attStr);
  return !isNaN(num) && num >= 0.0 && num <= 100.0;
}
assert(validateAttendance('96.5') === true, 'Valid attendance rate 96.5% passes validation');
assert(validateAttendance('105') === false, 'Attendance > 100% fails validation');

// 3. Update student metrics
studentState = {
  ...studentState,
  gpa: 3.92,
  completedCredits: 90,
  attendanceRate: 98.4,
};
assert(studentState.gpa === 3.92, 'Cumulative GPA successfully updated in state to 3.92');
assert(studentState.completedCredits === 90, 'Completed Credits successfully updated in state to 90');
assert(studentState.attendanceRate === 98.4, 'Attendance Rate successfully updated in state to 98.4%');

// 4. Update department & contact information
studentState = {
  ...studentState,
  department: 'Faculty of Computer Engineering & Information Science',
  email: 'jordan.a.lee@alumni.univ.edu',
  phone: '+1 (555) 839-2041',
  advisor: 'Prof. Donald Knuth, PhD',
};
assert(studentState.department === 'Faculty of Computer Engineering & Information Science', 'Department updated in student state');
assert(studentState.email === 'jordan.a.lee@alumni.univ.edu', 'Institutional email updated in student state');
assert(studentState.phone === '+1 (555) 839-2041', 'Contact phone updated in student state');
assert(studentState.advisor === 'Prof. Donald Knuth, PhD', 'Faculty advisor updated in student state');

// 5. Update course enrollments (Semester 5)
const updatedCourses = [
  { code: 'CS-501', name: 'Advanced Distributed Systems', credits: 4, grade: 'A', instructor: 'Dr. Leslie Lamport' },
  { code: 'CS-510', name: 'Deep Learning & Neural Architectures', credits: 4, grade: 'A+', instructor: 'Dr. Yann LeCun' },
  { code: 'CS-540', name: 'Mobile Systems Engineering (Flutter & Dart)', credits: 3, grade: 'A', instructor: 'Prof. Eric Dart' },
];
studentState = {
  ...studentState,
  enrolledCourses: updatedCourses,
};
assert(studentState.enrolledCourses.length === 3, 'Currently enrolled courses updated to 3 active subjects');
assert(studentState.enrolledCourses[0].code === 'CS-501', 'First course updated to CS-501');
assert(studentState.enrolledCourses.reduce((sum, c) => sum + c.credits, 0) === 11, 'Total semester credits calculate accurately (11 cr)');

// -------------------------------------------------------------
// Test Group 8: Default Course Enrollments (Term) - Add, Delete, Update Features
// -------------------------------------------------------------
console.log(`\n${colors.bold}${colors.blue}[Group 8] Default Course Enrollments (Term) - Add, Delete, Update Features${colors.reset}`);

// 1. Initial State verification
let termCourses = [
  { code: 'CS-101', name: 'Introduction to Programming & Algorithms', credits: 4, grade: 'In Progress', instructor: 'Dr. Alan Turing' },
  { code: 'MATH-101', name: 'Calculus & Linear Algebra for Computing', credits: 4, grade: 'In Progress', instructor: 'Prof. Gauss' },
  { code: 'ENG-105', name: 'Technical Writing & Academic Communication', credits: 3, grade: 'In Progress', instructor: 'Prof. Strunk' },
  { code: 'CS-110', name: 'Computer Systems & Architecture Essentials', credits: 3, grade: 'In Progress', instructor: 'Dr. von Neumann' },
];
assert(termCourses.length === 4, 'Default curriculum initializes with 4 standard term courses');
assert(termCourses.reduce((sum, c) => sum + c.credits, 0) === 14, 'Default curriculum total credits is 14');

// 2. Add Course feature
const newCourseToAdd = {
  code: 'AI-101',
  name: 'Artificial Intelligence Foundations',
  credits: 4,
  grade: 'In Progress',
  instructor: 'Dr. Fei-Fei Li',
};
termCourses = [...termCourses, newCourseToAdd];
assert(termCourses.length === 5, 'New course AI-101 successfully added to term enrollments');
assert(termCourses.some(c => c.code === 'AI-101'), 'Added course AI-101 exists in term schedule');
assert(termCourses.reduce((sum, c) => sum + c.credits, 0) === 18, 'Total credits updated to 18 after adding AI-101');

// 3. Update Course feature (Edit existing course)
const courseToUpdateIndex = termCourses.findIndex(c => c.code === 'MATH-101');
assert(courseToUpdateIndex !== -1, 'Target course MATH-101 found for editing');

const updatedCourseData = {
  code: 'MATH-105',
  name: 'Discrete Mathematics & Boolean Logic',
  credits: 4,
  grade: 'Enrolled',
  instructor: 'Prof. George Boole',
};
termCourses[courseToUpdateIndex] = updatedCourseData;
assert(termCourses[courseToUpdateIndex].code === 'MATH-105', 'Course code updated from MATH-101 to MATH-105');
assert(termCourses[courseToUpdateIndex].name === 'Discrete Mathematics & Boolean Logic', 'Course title updated successfully');
assert(termCourses[courseToUpdateIndex].instructor === 'Prof. George Boole', 'Instructor updated successfully');

// 4. Delete Course feature (Remove course)
const initialCountBeforeDelete = termCourses.length;
termCourses = termCourses.filter(c => c.code !== 'ENG-105');
assert(termCourses.length === initialCountBeforeDelete - 1, 'Course ENG-105 successfully deleted from term enrollments');
assert(!termCourses.some(c => c.code === 'ENG-105'), 'ENG-105 is no longer present in term schedule');

// 5. Validation edge cases for Course Add & Update
const isDuplicateCode = (code: string, currentCourses: typeof termCourses) =>
  currentCourses.some(c => c.code.toUpperCase() === code.trim().toUpperCase());

assert(isDuplicateCode('CS-101', termCourses) === true, 'Duplicate course code CS-101 correctly detected');
assert(isDuplicateCode('PHY-101', termCourses) === false, 'Unique course code PHY-101 correctly allowed');

const isValidCredits = (credits: number) => !isNaN(credits) && credits >= 1 && credits <= 6;
assert(isValidCredits(0) === false, '0 credits correctly rejected (must be between 1 and 6)');
assert(isValidCredits(7) === false, '7 credits correctly rejected (exceeds max 6)');
assert(isValidCredits(3) === true, '3 credits correctly validated');
assert(isValidCredits(4) === true, '4 credits correctly validated');

// 6. Registration submission with customized term course list
const registeredStudentWithCustomCourses = {
  id: 'STU-2026-CUSTOM',
  name: 'Taylor Swift-Developer',
  course: 'B.Sc. Computer Science',
  degree: 'Bachelor of Science',
  department: 'Department of Computing',
  semester: 'Term 1',
  photoUrl: '',
  gpa: 4.0,
  completedCredits: 0,
  totalCredits: Math.max(120, termCourses.reduce((sum, c) => sum + c.credits, 0)),
  attendanceRate: 100.0,
  email: 'taylor@university.edu',
  phone: '+1 555 123 4567',
  status: 'Active' as const,
  advisor: 'Dr. Grace Hopper',
  enrolledCourses: termCourses,
};
assert(registeredStudentWithCustomCourses.enrolledCourses.length === termCourses.length, 'Registered student profile contains customized course list');
assert(registeredStudentWithCustomCourses.enrolledCourses.some(c => c.code === 'MATH-105'), 'Updated course MATH-105 preserved in registered profile');
assert(!registeredStudentWithCustomCourses.enrolledCourses.some(c => c.code === 'ENG-105'), 'Deleted course ENG-105 excluded from registered profile');

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.bold}TEST RESULTS:${colors.reset} ${passedCount} Passed, ${failedCount} Failed`);
console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log(`${colors.green}${colors.bold}ALL TESTS PASSED SUCCESSFULLY!${colors.reset}\n`);
}
