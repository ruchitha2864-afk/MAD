import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building2, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Camera, 
  Upload, 
  Link, 
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Hash,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { StudentProfile, EnrolledCourse, avatarPresets } from '../types/student';
import { FlutterCircleAvatar } from '../components/FlutterCircleAvatar';

interface StudentRegistrationScreenProps {
  onPop: () => void;
  onRegister: (newStudent: StudentProfile) => void;
  isDarkMode: boolean;
}

const availableMajors = [
  'B.Sc. Computer Science & Software Engineering',
  'B.Tech. Artificial Intelligence & Robotics',
  'B.Eng. Electrical & Mechatronics',
  'B.Sc. Data Science & Machine Learning',
  'B.S. Cybersecurity & Information Assurance',
  'B.Des. Human-Computer Interaction',
  'B.Sc. Cloud Computing & Networks',
];

const availableDepartments = [
  'Department of Computing and Information Sciences',
  'Department of Electrical & Robotics Engineering',
  'School of Artificial Intelligence & Data Science',
  'Department of Design & Digital Media',
];

const availableSemesters = [
  'Year 1 • Semester 1',
  'Year 1 • Semester 2',
  'Year 2 • Semester 3',
  'Year 2 • Semester 4',
  'Year 3 • Semester 5',
  'Year 4 • Semester 7',
];

const defaultStartingCourses: Record<string, EnrolledCourse[]> = {
  default: [
    { code: 'CS-101', name: 'Introduction to Programming & Algorithms', credits: 4, grade: 'In Progress', instructor: 'Dr. Alan Turing' },
    { code: 'MATH-101', name: 'Calculus & Linear Algebra for Computing', credits: 4, grade: 'In Progress', instructor: 'Prof. Gauss' },
    { code: 'ENG-105', name: 'Technical Writing & Academic Communication', credits: 3, grade: 'In Progress', instructor: 'Prof. Strunk' },
    { code: 'CS-110', name: 'Computer Systems & Architecture Essentials', credits: 3, grade: 'In Progress', instructor: 'Dr. von Neumann' },
  ]
};

export const StudentRegistrationScreen: React.FC<StudentRegistrationScreenProps> = ({
  onPop,
  onRegister,
  isDarkMode,
}) => {
  // Form State
  const [name, setName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>(() => `STU-2025-${Math.floor(1000 + Math.random() * 9000)}`);
  const [course, setCourse] = useState<string>(availableMajors[0]);
  const [degree, setDegree] = useState<string>('Bachelor of Science');
  const [department, setDepartment] = useState<string>(availableDepartments[0]);
  const [semester, setSemester] = useState<string>(availableSemesters[0]);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [advisor, setAdvisor] = useState<string>('Prof. Katherine Johnson, PhD');
  
  // Photo State
  const [photoUrl, setPhotoUrl] = useState<string>(avatarPresets[2].url);
  const [photoSourceTab, setPhotoSourceTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [customUrl, setCustomUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Section 3: Default Course Enrollments State
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([
    { code: 'CS-101', name: 'Introduction to Programming & Algorithms', credits: 4, grade: 'In Progress', instructor: 'Dr. Alan Turing' },
    { code: 'MATH-101', name: 'Calculus & Linear Algebra for Computing', credits: 4, grade: 'In Progress', instructor: 'Prof. Gauss' },
    { code: 'ENG-105', name: 'Technical Writing & Academic Communication', credits: 3, grade: 'In Progress', instructor: 'Prof. Strunk' },
    { code: 'CS-110', name: 'Computer Systems & Architecture Essentials', credits: 3, grade: 'In Progress', instructor: 'Dr. von Neumann' },
  ]);

  // Course Form State (Add)
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
  const [newCourseCode, setNewCourseCode] = useState<string>('');
  const [newCourseName, setNewCourseName] = useState<string>('');
  const [newCourseCredits, setNewCourseCredits] = useState<number>(3);
  const [newCourseInstructor, setNewCourseInstructor] = useState<string>('');
  const [newCourseGrade, setNewCourseGrade] = useState<string>('In Progress');
  const [courseError, setCourseError] = useState<string>('');

  // Course Form State (Update / Edit)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCourseCode, setEditCourseCode] = useState<string>('');
  const [editCourseName, setEditCourseName] = useState<string>('');
  const [editCourseCredits, setEditCourseCredits] = useState<number>(3);
  const [editCourseInstructor, setEditCourseInstructor] = useState<string>('');
  const [editCourseGrade, setEditCourseGrade] = useState<string>('In Progress');
  const [editError, setEditError] = useState<string>('');

  // Add course to default enrollments
  const handleAddCourse = () => {
    const trimmedCode = newCourseCode.trim().toUpperCase();
    const trimmedName = newCourseName.trim();
    if (!trimmedCode) {
      setCourseError('Course code is required (e.g., CS-120)');
      return;
    }
    if (!trimmedName) {
      setCourseError('Course title is required');
      return;
    }
    if (enrolledCourses.some(c => c.code.toUpperCase() === trimmedCode)) {
      setCourseError(`Course ${trimmedCode} is already in the enrollment list`);
      return;
    }
    const creds = Number(newCourseCredits);
    if (isNaN(creds) || creds < 1 || creds > 6) {
      setCourseError('Credits must be a number between 1 and 6');
      return;
    }

    const newCourse: EnrolledCourse = {
      code: trimmedCode,
      name: trimmedName,
      credits: creds,
      instructor: newCourseInstructor.trim() || 'Assigned Faculty',
      grade: newCourseGrade || 'In Progress',
    };

    setEnrolledCourses(prev => [...prev, newCourse]);
    setNewCourseCode('');
    setNewCourseName('');
    setNewCourseCredits(3);
    setNewCourseInstructor('');
    setNewCourseGrade('In Progress');
    setCourseError('');
    setIsAddingCourse(false);
  };

  // Delete course from enrollments
  const handleDeleteCourse = (indexToDelete: number) => {
    setEnrolledCourses(prev => prev.filter((_, idx) => idx !== indexToDelete));
    if (editingIndex === indexToDelete) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > indexToDelete) {
      setEditingIndex(editingIndex - 1);
    }
  };

  // Start editing course
  const handleStartEditCourse = (index: number) => {
    const c = enrolledCourses[index];
    if (!c) return;
    setEditingIndex(index);
    setEditCourseCode(c.code);
    setEditCourseName(c.name);
    setEditCourseCredits(c.credits);
    setEditCourseInstructor(c.instructor);
    setEditCourseGrade(c.grade || 'In Progress');
    setEditError('');
    setIsAddingCourse(false);
  };

  // Save updated course
  const handleSaveUpdateCourse = () => {
    if (editingIndex === null) return;
    const trimmedCode = editCourseCode.trim().toUpperCase();
    const trimmedName = editCourseName.trim();

    if (!trimmedCode) {
      setEditError('Course code is required');
      return;
    }
    if (!trimmedName) {
      setEditError('Course title is required');
      return;
    }
    const creds = Number(editCourseCredits);
    if (isNaN(creds) || creds < 1 || creds > 6) {
      setEditError('Credits must be between 1 and 6');
      return;
    }

    // Check code collision with other courses
    const conflict = enrolledCourses.findIndex(
      (c, idx) => idx !== editingIndex && c.code.toUpperCase() === trimmedCode
    );
    if (conflict !== -1) {
      setEditError(`Course code ${trimmedCode} is already used by another course`);
      return;
    }

    setEnrolledCourses(prev => {
      const updated = [...prev];
      updated[editingIndex] = {
        code: trimmedCode,
        name: trimmedName,
        credits: creds,
        instructor: editCourseInstructor.trim() || 'Assigned Faculty',
        grade: editCourseGrade || 'In Progress',
      };
      return updated;
    });

    setEditingIndex(null);
    setEditError('');
  };

  // Reset course enrollments to default
  const handleResetDefaultCourses = () => {
    setEnrolledCourses([
      { code: 'CS-101', name: 'Introduction to Programming & Algorithms', credits: 4, grade: 'In Progress', instructor: 'Dr. Alan Turing' },
      { code: 'MATH-101', name: 'Calculus & Linear Algebra for Computing', credits: 4, grade: 'In Progress', instructor: 'Prof. Gauss' },
      { code: 'ENG-105', name: 'Technical Writing & Academic Communication', credits: 3, grade: 'In Progress', instructor: 'Prof. Strunk' },
      { code: 'CS-110', name: 'Computer Systems & Architecture Essentials', credits: 3, grade: 'In Progress', instructor: 'Dr. von Neumann' },
    ]);
    setEditingIndex(null);
    setIsAddingCourse(false);
  };

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File upload simulation (Flutter ImagePicker)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'File must be an image (PNG, JPG, WEBP)' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        setErrors(prev => {
          const updated = { ...prev };
          delete updated.photo;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim().startsWith('http')) {
      setErrors(prev => ({ ...prev, photo: 'Please enter a valid URL beginning with https://' }));
      return;
    }
    setPhotoUrl(customUrl.trim());
    setErrors(prev => {
      const updated = { ...prev };
      delete updated.photo;
      return updated;
    });
  };

  // Form Validation mimicking Flutter FormState.validate()
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full student name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid institutional email';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    } else if (phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!advisor.trim()) {
      newErrors.advisor = 'Assigned faculty advisor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pre-fill quick demo data for testing
  const handlePrefillDemo = () => {
    setName('Jordan Alexander Lee');
    setEmail('jordan.lee@university.edu');
    setPhone('+1 (555) 782-9901');
    setCourse('B.Tech. Artificial Intelligence & Robotics');
    setDepartment('School of Artificial Intelligence & Data Science');
    setSemester('Year 1 • Semester 1');
    setPhotoUrl(avatarPresets[5].url);
    setAdvisor('Dr. Fei-Fei Li, PhD');
    setEnrolledCourses([
      { code: 'AI-101', name: 'Foundations of Artificial Intelligence', credits: 4, grade: 'In Progress', instructor: 'Dr. Fei-Fei Li' },
      { code: 'ROB-110', name: 'Kinematics & Autonomous Systems', credits: 4, grade: 'In Progress', instructor: 'Dr. Rodney Brooks' },
      { code: 'MATH-201', name: 'Multivariate Calculus & Optimization', credits: 4, grade: 'In Progress', instructor: 'Prof. Terrence Tao' },
      { code: 'CS-108', name: 'Object-Oriented Design in Python & C++', credits: 3, grade: 'In Progress', instructor: 'Prof. Bjarne Stroustrup' },
    ]);
    setEditingIndex(null);
    setIsAddingCourse(false);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const totalEnrolledCredits = enrolledCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

    const newStudent: StudentProfile = {
      id: studentId,
      name: name.trim(),
      course,
      degree,
      department,
      semester,
      photoUrl,
      gpa: 4.0,
      completedCredits: 0,
      totalCredits: Math.max(120, totalEnrolledCredits),
      attendanceRate: 100.0,
      email: email.trim(),
      phone: phone.trim(),
      status: 'Active',
      advisor: advisor.trim(),
      enrolledCourses: enrolledCourses,
    };

    // Navigator.pop(context, newStudent)
    onRegister(newStudent);
  };

  return (
    // Flutter Widget: Scaffold
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100/80 text-slate-900'
    }`}>
      {/* Flutter Widget: AppBar */}
      <header className={`sticky top-0 z-30 border-b shadow-sm transition-colors ${
        isDarkMode 
          ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100' 
          : 'bg-white/95 border-slate-200 text-slate-900'
      } backdrop-blur-md`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button: Navigator.pop(context) */}
            <button
              onClick={onPop}
              title="Return to Student Profile"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <span>Student Registration</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                  New Record
                </span>
              </h1>
              <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
                Academic Portal • Screen 3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrefillDemo}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto-fill Demo</span>
            </button>

            <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-[11px] font-mono font-medium text-slate-600 dark:text-zinc-400 hidden sm:inline">
              Route: /register
            </span>
          </div>
        </div>
      </header>

      {/* Flutter Widget: Scaffold Body (SingleChildScrollView + Center + Padding) */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Profile Photo & Identification */}
          <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
            isDarkMode 
              ? 'bg-zinc-900/90 border-zinc-800 shadow-black/40' 
              : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-5 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Section 1: Student Identity & Photo</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              {/* Photo Preview with Camera trigger */}
              <div className="relative group shrink-0">
                <FlutterCircleAvatar
                  photoUrl={photoUrl}
                  name={name || 'New Student'}
                  size="xl"
                  showBadge={true}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload from device"
                  className="absolute bottom-1 right-1 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border-2 border-white dark:border-zinc-900 cursor-pointer transition-transform hover:scale-110"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Source Selector */}
              <div className="flex-1 w-full">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 block mb-2">
                  Select Profile Avatar
                </span>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 mb-3 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPhotoSourceTab('presets')}
                    className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      photoSourceTab === 'presets'
                        ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoSourceTab('upload')}
                    className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      photoSourceTab === 'upload'
                        ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoSourceTab('url')}
                    className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      photoSourceTab === 'url'
                        ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>URL</span>
                  </button>
                </div>

                {/* Tab 1: Presets */}
                {photoSourceTab === 'presets' && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    {avatarPresets.map((preset) => {
                      const isSelected = photoUrl === preset.url;
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setPhotoUrl(preset.url)}
                          title={preset.name}
                          className={`relative w-11 h-11 rounded-full p-0.5 shrink-0 transition-all cursor-pointer ${
                            isSelected ? 'ring-3 ring-indigo-500 scale-105' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-indigo-600/30 rounded-full flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Tab 2: Upload */}
                {photoSourceTab === 'upload' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-500 text-xs font-medium text-slate-600 dark:text-zinc-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-indigo-500" />
                      <span>Choose file from device</span>
                    </button>
                  </div>
                )}

                {/* Tab 3: URL */}
                {photoSourceTab === 'url' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-transparent text-xs outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-500 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {errors.photo && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.photo}
                  </p>
                )}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                  Full Student Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Samantha Vance"
                    className={`w-full px-3.5 py-3 pl-10 text-sm font-medium rounded-xl border transition-all outline-none ${
                      errors.name
                        ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-500/20'
                        : isDarkMode
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                    }`}
                  />
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Student ID (Auto-Generated) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
                    Student ID Number
                  </label>
                  <button
                    type="button"
                    onClick={() => setStudentId(`STU-2025-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[11px] text-indigo-500 hover:text-indigo-400 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className={`w-full px-3.5 py-3 pl-10 text-sm font-mono font-medium rounded-xl border outline-none ${
                      isDarkMode
                        ? 'bg-zinc-800/50 border-zinc-700 text-zinc-200'
                        : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  />
                  <Hash className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                  Institutional Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="student@university.edu"
                    className={`w-full px-3.5 py-3 pl-10 text-sm font-medium rounded-xl border transition-all outline-none ${
                      errors.email
                        ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-500/20'
                        : isDarkMode
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                    }`}
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                  Contact Phone *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-3.5 py-3 pl-10 text-sm font-medium rounded-xl border transition-all outline-none ${
                      errors.phone
                        ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-500/20'
                        : isDarkMode
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                    }`}
                  />
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Academic Program & Faculty */}
          <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
            isDarkMode 
              ? 'bg-zinc-900/90 border-zinc-800 shadow-black/40' 
              : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-5 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Section 2: Academic Program & Degree</span>
            </h2>

            <div className="space-y-4">
              {/* Major / Course */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                  Degree Course / Major *
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className={`w-full px-3.5 py-3 text-sm font-medium rounded-xl border outline-none cursor-pointer ${
                    isDarkMode
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                  }`}
                >
                  {availableMajors.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Department & Semester Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Academic Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full px-3.5 py-3 text-sm font-medium rounded-xl border outline-none cursor-pointer ${
                      isDarkMode
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                    }`}
                  >
                    {availableDepartments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Starting Academic Term
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className={`w-full px-3.5 py-3 text-sm font-medium rounded-xl border outline-none cursor-pointer ${
                      isDarkMode
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                    }`}
                  >
                    {availableSemesters.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assigned Advisor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                  Assigned Faculty Advisor *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={advisor}
                    onChange={(e) => {
                      setAdvisor(e.target.value);
                      if (errors.advisor) setErrors(prev => ({ ...prev, advisor: '' }));
                    }}
                    className={`w-full px-3.5 py-3 pl-10 text-sm font-medium rounded-xl border transition-all outline-none ${
                      errors.advisor
                        ? 'border-red-500 bg-red-50/10'
                        : isDarkMode
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                    }`}
                  />
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Default Course Enrollments (Term ) - with Add, Delete, and Update features */}
          <div className={`rounded-3xl p-6 border transition-all ${
            isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>Default Course Enrollments ({semester || 'Term 1'})</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Configure starting semester curriculum: add new courses, update details, or remove subjects
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                  {enrolledCourses.length} Courses • {enrolledCourses.reduce((sum, c) => sum + (c.credits || 0), 0)} Credits
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCourse(true);
                    setEditingIndex(null);
                    setCourseError('');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaultCourses}
                  title="Reset to default course catalog"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add Course Form Modal / Card */}
            {isAddingCourse && (
              <div className="mb-4 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Add New Term Course Enrollment
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCourse(false);
                      setCourseError('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS-120 or MATH-205"
                      value={newCourseCode}
                      onChange={(e) => {
                        setNewCourseCode(e.target.value);
                        if (courseError) setCourseError('');
                      }}
                      className="w-full px-3 py-2 text-xs font-mono font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Data Structures & Object Oriented Design"
                      value={newCourseName}
                      onChange={(e) => {
                        setNewCourseName(e.target.value);
                        if (courseError) setCourseError('');
                      }}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                      Course Credits (1 - 6) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      placeholder="Credits (e.g. 3 or 4)"
                      value={newCourseCredits}
                      onChange={(e) => {
                        setNewCourseCredits(parseInt(e.target.value, 10) || 1);
                        if (courseError) setCourseError('');
                      }}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                      Assigned Instructor
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Ada Lovelace"
                      value={newCourseInstructor}
                      onChange={(e) => setNewCourseInstructor(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                      Enrollment Status / Initial Grade
                    </label>
                    <select
                      value={newCourseGrade}
                      onChange={(e) => setNewCourseGrade(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="In Progress">In Progress (Active Term)</option>
                      <option value="Enrolled">Enrolled (Pending First Class)</option>
                      <option value="Registered">Registered (Tuition Confirmed)</option>
                      <option value="Audit">Audit (Non-Credit)</option>
                    </select>
                  </div>
                </div>

                {courseError && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{courseError}</span>
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Course Schedule</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCourse(false);
                      setCourseError('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Courses List */}
            <div className="space-y-2.5">
              {enrolledCourses.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                    No courses enrolled for this term yet.
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 mb-3">
                    Add courses using the "+ Add Course" button or restore defaults.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetDefaultCourses}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 transition-colors cursor-pointer"
                  >
                    Restore Default Curriculum
                  </button>
                </div>
              ) : (
                enrolledCourses.map((c, idx) => {
                  const isEditingThis = editingIndex === idx;

                  if (isEditingThis) {
                    return (
                      <div
                        key={`edit-${idx}`}
                        className="p-4 rounded-2xl border border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3 animate-in fade-in duration-150 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Update Course Details ({c.code})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingIndex(null);
                              setEditError('');
                            }}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                              Course Code *
                            </label>
                            <input
                              type="text"
                              value={editCourseCode}
                              onChange={(e) => {
                                setEditCourseCode(e.target.value);
                                if (editError) setEditError('');
                              }}
                              className="w-full px-3 py-1.5 text-xs font-mono font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                              Course Title *
                            </label>
                            <input
                              type="text"
                              value={editCourseName}
                              onChange={(e) => {
                                setEditCourseName(e.target.value);
                                if (editError) setEditError('');
                              }}
                              className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                              Credits (1 - 6) *
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="6"
                              value={editCourseCredits}
                              onChange={(e) => {
                                setEditCourseCredits(parseInt(e.target.value, 10) || 1);
                                if (editError) setEditError('');
                              }}
                              className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                              Instructor
                            </label>
                            <input
                              type="text"
                              value={editCourseInstructor}
                              onChange={(e) => setEditCourseInstructor(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-zinc-400 mb-1">
                              Enrollment Status / Grade
                            </label>
                            <select
                              value={editCourseGrade}
                              onChange={(e) => setEditCourseGrade(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500 cursor-pointer"
                            >
                              <option value="In Progress">In Progress (Active Term)</option>
                              <option value="Enrolled">Enrolled (Pending First Class)</option>
                              <option value="Registered">Registered (Tuition Confirmed)</option>
                              <option value="Audit">Audit (Non-Credit)</option>
                              <option value="A">Grade: A</option>
                              <option value="A-">Grade: A-</option>
                              <option value="B+">Grade: B+</option>
                            </select>
                          </div>
                        </div>

                        {editError && (
                          <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{editError}</span>
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleSaveUpdateCourse}
                            className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Course Update</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingIndex(null);
                              setEditError('');
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${c.code}-${idx}`}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDarkMode
                          ? 'bg-zinc-800/40 hover:bg-zinc-800/70 border-zinc-800/80'
                          : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {c.code}
                          </span>
                          <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100 truncate">
                            {c.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                          <span>Instructor: <span className="font-medium text-slate-700 dark:text-zinc-300">{c.instructor}</span></span>
                          <span>•</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{c.grade || 'In Progress'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                          {c.credits} cr
                        </span>

                        {/* Update / Edit Course Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEditCourse(idx)}
                          title={`Update course ${c.code}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Delete Course Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(idx)}
                          title={`Delete course ${c.code}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions: ElevatedButton (Submit) & OutlinedButton (Cancel) */}
          <div className="space-y-3 pt-2">
            {/* Flutter Widget: ElevatedButton */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 active:scale-[0.98] text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              <span>Complete Registration & Open Student Profile</span>
            </button>

            {/* Flutter Widget: OutlinedButton */}
            <button
              type="button"
              onClick={onPop}
              className={`w-full py-3 px-6 rounded-2xl font-semibold text-xs border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Cancel (Return to Profile)
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-zinc-500 font-mono">
            Navigator.pop(context, newStudentProfile)
          </div>

        </form>
      </main>
    </div>
  );
};
