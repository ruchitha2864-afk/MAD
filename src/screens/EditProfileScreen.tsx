import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  User, 
  X, 
  Sparkles, 
  Info, 
  AlertCircle,
  Camera,
  Upload,
  Link,
  Image as ImageIcon,
  RotateCcw,
  TrendingUp,
  BookOpen,
  Building2,
  Mail,
  Phone,
  Award,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { StudentProfile, EnrolledCourse, avatarPresets } from '../types/student';
import { FlutterCircleAvatar } from '../components/FlutterCircleAvatar';

export type EditTab = 'personal' | 'stats' | 'contact' | 'courses';

interface EditProfileScreenProps {
  currentName: string;
  currentPhotoUrl?: string;
  student: StudentProfile;
  initialTab?: EditTab;
  onPop: () => void;
  onSave: (updatedProfile: StudentProfile) => void;
  isDarkMode: boolean;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  currentName,
  currentPhotoUrl,
  student,
  initialTab = 'personal',
  onPop,
  onSave,
  isDarkMode,
}) => {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<EditTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Tab 1: Personal & Photo
  const [nameInput, setNameInput] = useState<string>(currentName || student.name);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentPhotoUrl || student.photoUrl);
  const [photoSourceTab, setPhotoSourceTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [urlInput, setUrlInput] = useState<string>('');
  const [degreeCourse, setDegreeCourse] = useState<string>(student.course);
  const [studentStatus, setStudentStatus] = useState<StudentProfile['status']>(student.status);

  // Tab 2: Academic Metrics
  const [gpaInput, setGpaInput] = useState<string>(student.gpa.toString());
  const [completedCreditsInput, setCompletedCreditsInput] = useState<string>(student.completedCredits.toString());
  const [totalCreditsInput, setTotalCreditsInput] = useState<string>(student.totalCredits.toString());
  const [attendanceRateInput, setAttendanceRateInput] = useState<string>(student.attendanceRate.toString());

  // Tab 3: Department & Contact Information
  const [departmentInput, setDepartmentInput] = useState<string>(student.department);
  const [degreeInput, setDegreeInput] = useState<string>(student.degree);
  const [semesterInput, setSemesterInput] = useState<string>(student.semester);
  const [emailInput, setEmailInput] = useState<string>(student.email);
  const [phoneInput, setPhoneInput] = useState<string>(student.phone);
  const [advisorInput, setAdvisorInput] = useState<string>(student.advisor);

  // Tab 4: Currently Enrolled Courses
  const [courses, setCourses] = useState<EnrolledCourse[]>([...student.enrolledCourses]);
  
  // State for new course dialog/form
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
  const [newCourseCode, setNewCourseCode] = useState<string>('');
  const [newCourseName, setNewCourseName] = useState<string>('');
  const [newCourseCredits, setNewCourseCredits] = useState<number>(3);
  const [newCourseGrade, setNewCourseGrade] = useState<string>('In Progress');
  const [newCourseInstructor, setNewCourseInstructor] = useState<string>('');

  // State for editing course
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);
  const [editCourseCode, setEditCourseCode] = useState<string>('');
  const [editCourseName, setEditCourseName] = useState<string>('');
  const [editCourseCredits, setEditCourseCredits] = useState<number>(3);
  const [editCourseGrade, setEditCourseGrade] = useState<string>('In Progress');
  const [editCourseInstructor, setEditCourseInstructor] = useState<string>('');
  const [editCourseError, setEditCourseError] = useState<string>('');

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload simulation (Flutter ImagePicker.pickImage(source: ImageSource.gallery))
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUploadError('Please enter an image URL');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setUploadError('URL must start with https:// or http://');
      return;
    }
    setUploadError('');
    setSelectedPhoto(trimmed);
  };

  // Add course helper
  const handleAddCourse = () => {
    if (!newCourseCode.trim() || !newCourseName.trim()) {
      setErrors(prev => ({ ...prev, course: 'Course code and course title are required' }));
      return;
    }

    const newEntry: EnrolledCourse = {
      code: newCourseCode.trim().toUpperCase(),
      name: newCourseName.trim(),
      credits: Number(newCourseCredits) || 3,
      grade: newCourseGrade.trim() || 'In Progress',
      instructor: newCourseInstructor.trim() || 'Staff Faculty',
    };

    setCourses(prev => [...prev, newEntry]);
    setNewCourseCode('');
    setNewCourseName('');
    setNewCourseCredits(3);
    setNewCourseInstructor('');
    setNewCourseGrade('In Progress');
    setIsAddingCourse(false);
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.course;
      return copy;
    });
  };

  const handleRemoveCourse = (codeToRemove: string) => {
    setCourses(prev => prev.filter(c => c.code !== codeToRemove));
    if (editingCourseIndex !== null && courses[editingCourseIndex]?.code === codeToRemove) {
      setEditingCourseIndex(null);
    }
  };

  const handleStartEditCourse = (index: number) => {
    const c = courses[index];
    if (!c) return;
    setEditingCourseIndex(index);
    setEditCourseCode(c.code);
    setEditCourseName(c.name);
    setEditCourseCredits(c.credits);
    setEditCourseGrade(c.grade || 'In Progress');
    setEditCourseInstructor(c.instructor);
    setEditCourseError('');
    setIsAddingCourse(false);
  };

  const handleSaveUpdateCourse = () => {
    if (editingCourseIndex === null) return;
    const trimmedCode = editCourseCode.trim().toUpperCase();
    const trimmedName = editCourseName.trim();
    if (!trimmedCode || !trimmedName) {
      setEditCourseError('Course code and course title are required');
      return;
    }
    const creds = Number(editCourseCredits);
    if (isNaN(creds) || creds < 1 || creds > 6) {
      setEditCourseError('Credits must be between 1 and 6');
      return;
    }

    const conflict = courses.findIndex(
      (c, idx) => idx !== editingCourseIndex && c.code.toUpperCase() === trimmedCode
    );
    if (conflict !== -1) {
      setEditCourseError(`Course code ${trimmedCode} already exists in enrolled courses`);
      return;
    }

    setCourses(prev => {
      const updated = [...prev];
      updated[editingCourseIndex] = {
        code: trimmedCode,
        name: trimmedName,
        credits: creds,
        grade: editCourseGrade || 'In Progress',
        instructor: editCourseInstructor.trim() || 'Staff Faculty',
      };
      return updated;
    });

    setEditingCourseIndex(null);
    setEditCourseError('');
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!nameInput.trim()) {
      newErrors.name = 'Student name cannot be empty';
    } else if (nameInput.trim().length < 2) {
      newErrors.name = 'Student name must be at least 2 characters';
    }

    // GPA
    const gpaNum = parseFloat(gpaInput);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      newErrors.gpa = 'GPA must be a number between 0.00 and 4.00';
    }

    // Completed Credits
    const compCreditsNum = parseInt(completedCreditsInput, 10);
    const totalCreditsNum = parseInt(totalCreditsInput, 10);
    if (isNaN(compCreditsNum) || compCreditsNum < 0) {
      newErrors.completedCredits = 'Completed credits must be 0 or greater';
    }
    if (isNaN(totalCreditsNum) || totalCreditsNum <= 0) {
      newErrors.totalCredits = 'Total credits must be greater than 0';
    }

    // Attendance
    const attNum = parseFloat(attendanceRateInput);
    if (isNaN(attNum) || attNum < 0 || attNum > 100) {
      newErrors.attendance = 'Attendance rate must be between 0% and 100%';
    }

    // Email
    if (!emailInput.trim() || !emailInput.includes('@')) {
      newErrors.email = 'Valid institutional email is required';
    }

    // Phone
    if (!phoneInput.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      // Find which tab has errors and switch to it
      if (errors.name) setActiveTab('personal');
      else if (errors.gpa || errors.completedCredits || errors.totalCredits || errors.attendance) setActiveTab('stats');
      else if (errors.email || errors.phone) setActiveTab('contact');
      return;
    }

    const updatedProfile: StudentProfile = {
      ...student,
      name: nameInput.trim(),
      photoUrl: selectedPhoto,
      course: degreeCourse.trim(),
      status: studentStatus,
      gpa: parseFloat(parseFloat(gpaInput).toFixed(2)),
      completedCredits: parseInt(completedCreditsInput, 10),
      totalCredits: parseInt(totalCreditsInput, 10),
      attendanceRate: parseFloat(parseFloat(attendanceRateInput).toFixed(1)),
      department: departmentInput.trim(),
      degree: degreeInput.trim(),
      semester: semesterInput.trim(),
      email: emailInput.trim(),
      phone: phoneInput.trim(),
      advisor: advisorInput.trim(),
      enrolledCourses: courses,
    };

    // Navigator.pop(context, updatedProfile)
    onSave(updatedProfile);
  };

  const sampleNames = [
    'Samantha Vance',
    'Dr. Samantha Vance, PhD',
    'Alex Rivera, B.Tech',
    'Priya Sharma',
    'Marcus Alexander Chen',
    'Zara Al-Mansoor',
  ];

  return (
    // Flutter Widget: Scaffold
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100/80 text-slate-900'
    }`}>
      {/* Flutter Widget: AppBar with BackButton */}
      <header className={`sticky top-0 z-30 border-b shadow-sm transition-colors ${
        isDarkMode 
          ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100' 
          : 'bg-white/95 border-slate-200 text-slate-900'
      } backdrop-blur-md`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Flutter BackButton: Navigator.pop(context) */}
            <button
              onClick={onPop}
              title="Pop back to Screen 1 without saving"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold tracking-tight">Edit Student Profile</h1>
              <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
                Academic Portal • Screen 2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-[11px] font-mono font-medium text-slate-600 dark:text-zinc-400 hidden sm:inline">
              Route: /edit
            </span>
          </div>
        </div>
      </header>

      {/* Flutter Widget: TabBar / Navigation Tabs */}
      <div className={`border-b ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Name & Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>GPA, Credits & Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Department & Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses ({courses.length})</span>
          </button>
        </div>
      </div>

      {/* Flutter Widget: Scaffold Body with SingleChildScrollView + Center + Padding */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className={`w-full rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
          isDarkMode 
            ? 'bg-zinc-900/90 border-zinc-800 shadow-black/40' 
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>

          {/* ========================================================= */}
          {/* TAB 1: Name, Photo & Program                             */}
          {/* ========================================================= */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>Student Identity & Photo</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Modify display name, academic status, and avatar image
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                  ID: {student.id}
                </span>
              </div>

              {/* Profile Image Edit Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-200 dark:border-zinc-800">
                <div className="relative group shrink-0">
                  <FlutterCircleAvatar
                    photoUrl={selectedPhoto}
                    name={nameInput || 'Student'}
                    size="lg"
                    showBadge={true}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload from device"
                    className="absolute bottom-1 right-1 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border-2 border-white dark:border-zinc-900 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
                      Profile Avatar
                    </span>
                    {selectedPhoto !== student.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPhoto(student.photoUrl);
                          setUploadError('');
                        }}
                        className="text-xs text-indigo-500 hover:text-indigo-400 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Photo Tabs */}
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

                  {photoSourceTab === 'presets' && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                      {avatarPresets.map((preset) => {
                        const isSelected = selectedPhoto === preset.url;
                        return (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => {
                              setSelectedPhoto(preset.url);
                              setUploadError('');
                            }}
                            title={preset.name}
                            className={`relative w-11 h-11 rounded-full p-0.5 shrink-0 transition-all cursor-pointer ${
                              isSelected
                                ? 'ring-3 ring-indigo-500 scale-105'
                                : 'opacity-70 hover:opacity-100 hover:scale-105'
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
                        <span>Click to browse photo from computer / mobile</span>
                      </button>
                    </div>
                  )}

                  {photoSourceTab === 'url' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
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

                  {uploadError && (
                    <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {uploadError}
                    </p>
                  )}
                </div>
              </div>

              {/* Full Name TextField */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-2">
                  Student Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="Enter student full name..."
                    className={`w-full px-4 py-3 pl-11 text-sm font-medium rounded-2xl border transition-all outline-none ${
                      errors.name
                        ? 'border-red-500 bg-red-50/10'
                        : isDarkMode
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                    }`}
                  />
                  <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Degree Program & Academic Standing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-2">
                    Degree Program / Course
                  </label>
                  <input
                    type="text"
                    value={degreeCourse}
                    onChange={(e) => setDegreeCourse(e.target.value)}
                    className={`w-full px-4 py-2.5 text-xs font-medium rounded-xl border outline-none ${
                      isDarkMode
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-2">
                    Academic Standing
                  </label>
                  <select
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value as any)}
                    className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border outline-none cursor-pointer ${
                      isDarkMode
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Dean's List">Dean's List</option>
                    <option value="Honor Roll">Honor Roll</option>
                  </select>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block mb-2">
                  Sample Names:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setNameInput(name);
                        setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        nameInput === name
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isDarkMode
                          ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: Academic Metrics (GPA, Credits, Attendance)       */}
          {/* ========================================================= */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="border-b pb-4 border-slate-200 dark:border-zinc-800">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>Academic Performance Metrics</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Update Cumulative GPA, Completed Credits, and Attendance Rate
                </p>
              </div>

              {/* Live KPI Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">Preview GPA</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {parseFloat(gpaInput || '0').toFixed(2)} / 4.00
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">Preview Credits</span>
                  <span className="text-xl font-black text-slate-800 dark:text-zinc-200">
                    {completedCreditsInput || '0'} / {totalCreditsInput || '120'}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">Preview Attendance</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {attendanceRateInput || '0'}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Cumulative GPA */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Cumulative GPA (0.00 – 4.00) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={gpaInput}
                      onChange={(e) => {
                        setGpaInput(e.target.value);
                        if (errors.gpa) setErrors(prev => ({ ...prev, gpa: '' }));
                      }}
                      className={`w-full px-4 py-3 pl-11 text-sm font-semibold rounded-2xl border outline-none ${
                        errors.gpa
                          ? 'border-red-500 bg-red-50/10'
                          : isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      }`}
                    />
                    <TrendingUp className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                  {errors.gpa && (
                    <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.gpa}
                    </p>
                  )}
                </div>

                {/* Attendance Rate */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Attendance Rate (0 – 100%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={attendanceRateInput}
                      onChange={(e) => {
                        setAttendanceRateInput(e.target.value);
                        if (errors.attendance) setErrors(prev => ({ ...prev, attendance: '' }));
                      }}
                      className={`w-full px-4 py-3 pl-11 text-sm font-semibold rounded-2xl border outline-none ${
                        errors.attendance
                          ? 'border-red-500 bg-red-50/10'
                          : isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      }`}
                    />
                    <Sparkles className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                  {errors.attendance && (
                    <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.attendance}
                    </p>
                  )}
                </div>

                {/* Credits Completed */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Credits Completed *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={completedCreditsInput}
                      onChange={(e) => {
                        setCompletedCreditsInput(e.target.value);
                        if (errors.completedCredits) setErrors(prev => ({ ...prev, completedCredits: '' }));
                      }}
                      className={`w-full px-4 py-3 pl-11 text-sm font-semibold rounded-2xl border outline-none ${
                        errors.completedCredits
                          ? 'border-red-500 bg-red-50/10'
                          : isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      }`}
                    />
                    <BookOpen className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                  {errors.completedCredits && (
                    <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.completedCredits}
                    </p>
                  )}
                </div>

                {/* Total Program Credits */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Total Degree Credits *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={totalCreditsInput}
                      onChange={(e) => {
                        setTotalCreditsInput(e.target.value);
                        if (errors.totalCredits) setErrors(prev => ({ ...prev, totalCredits: '' }));
                      }}
                      className={`w-full px-4 py-3 pl-11 text-sm font-semibold rounded-2xl border outline-none ${
                        isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      }`}
                    />
                    <Award className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: Department & Contact Information                  */}
          {/* ========================================================= */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="border-b pb-4 border-slate-200 dark:border-zinc-800">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>Department & Contact Information</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Update institutional affiliation, academic advisor, and student contact
                </p>
              </div>

              <div className="space-y-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Academic Department *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={departmentInput}
                      onChange={(e) => setDepartmentInput(e.target.value)}
                      placeholder="e.g. Department of Computing and Information Sciences"
                      className={`w-full px-4 py-3 pl-11 text-sm font-medium rounded-2xl border outline-none ${
                        isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      }`}
                    />
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Degree */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                      Degree Level
                    </label>
                    <input
                      type="text"
                      value={degreeInput}
                      onChange={(e) => setDegreeInput(e.target.value)}
                      placeholder="e.g. Bachelor of Science"
                      className={`w-full px-4 py-2.5 text-xs font-medium rounded-xl border outline-none ${
                        isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                      Academic Term / Semester
                    </label>
                    <input
                      type="text"
                      value={semesterInput}
                      onChange={(e) => setSemesterInput(e.target.value)}
                      placeholder="e.g. Year 3 • Semester 5"
                      className={`w-full px-4 py-2.5 text-xs font-medium rounded-xl border outline-none ${
                        isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                      Institutional Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={`w-full px-4 py-3 pl-11 text-sm font-medium rounded-2xl border outline-none ${
                          errors.email
                            ? 'border-red-500 bg-red-50/10'
                            : isDarkMode
                            ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                      Contact Phone *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => {
                          setPhoneInput(e.target.value);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full px-4 py-3 pl-11 text-sm font-medium rounded-2xl border outline-none ${
                          errors.phone
                            ? 'border-red-500 bg-red-50/10'
                            : isDarkMode
                            ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
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

                {/* Faculty Advisor */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5">
                    Assigned Academic Advisor
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={advisorInput}
                      onChange={(e) => setAdvisorInput(e.target.value)}
                      placeholder="e.g. Dr. Robert Vance, PhD"
                      className={`w-full px-4 py-3 pl-11 text-sm font-medium rounded-2xl border outline-none ${
                        isDarkMode
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                      }`}
                    />
                    <Award className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: Currently Enrolled Courses                        */}
          {/* ========================================================= */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Currently Enrolled Courses</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Manage course units, credits, grades, and faculty instructors
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingCourse(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>
              </div>

              {/* Add New Course Dialog / Section */}
              {isAddingCourse && (
                <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      New Course Enrollment
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCourse(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Course Code (e.g. CS-450)"
                      value={newCourseCode}
                      onChange={(e) => setNewCourseCode(e.target.value)}
                      className="px-3 py-2 text-xs font-mono font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:border-indigo-500"
                    />

                    <input
                      type="text"
                      placeholder="Course Name (e.g. Distributed Cloud Systems)"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:border-indigo-500"
                    />

                    <input
                      type="number"
                      min="1"
                      max="6"
                      placeholder="Credits (e.g. 3 or 4)"
                      value={newCourseCredits}
                      onChange={(e) => setNewCourseCredits(parseInt(e.target.value, 10) || 3)}
                      className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:border-indigo-500"
                    />

                    <input
                      type="text"
                      placeholder="Instructor (e.g. Prof. Alan Turing)"
                      value={newCourseInstructor}
                      onChange={(e) => setNewCourseInstructor(e.target.value)}
                      className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:border-indigo-500"
                    />
                  </div>

                  {errors.course && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.course}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                  >
                    Confirm & Add to Schedule
                  </button>
                </div>
              )}

              {/* Current Courses List */}
              <div className="space-y-3">
                {courses.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No courses currently enrolled. Click "+ Add Course" to enroll.
                  </div>
                ) : (
                  courses.map((course, idx) => {
                    const isEditingThis = editingCourseIndex === idx;

                    if (isEditingThis) {
                      return (
                        <div
                          key={`edit-${idx}`}
                          className="p-4 rounded-2xl border border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3 animate-in fade-in duration-150 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Update Course Details ({course.code})</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCourseIndex(null);
                                setEditCourseError('');
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
                                  if (editCourseError) setEditCourseError('');
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
                                  if (editCourseError) setEditCourseError('');
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
                                  if (editCourseError) setEditCourseError('');
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
                                Grade / Status
                              </label>
                              <input
                                type="text"
                                value={editCourseGrade}
                                onChange={(e) => setEditCourseGrade(e.target.value)}
                                placeholder="e.g. In Progress, A, A-, B+"
                                className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>

                          {editCourseError && (
                            <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{editCourseError}</span>
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
                                setEditingCourseIndex(null);
                                setEditCourseError('');
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
                        key={`${course.code}-${idx}`}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                          isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                              {course.code}
                            </span>
                            <span className="font-semibold text-xs text-slate-800 dark:text-zinc-200 truncate">
                              {course.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-zinc-400 flex items-center gap-3">
                            <span>{course.instructor}</span>
                            <span>•</span>
                            <span className="font-medium text-emerald-500">Grade: {course.grade}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-500/10 text-indigo-500">
                            {course.credits} cr
                          </span>

                          <button
                            type="button"
                            onClick={() => handleStartEditCourse(idx)}
                            title={`Update course ${course.code}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(course.code)}
                            title={`Remove course ${course.code}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {courses.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/60 text-xs flex items-center justify-between font-semibold">
                  <span className="text-slate-600 dark:text-zinc-300">Semester Total Credits:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                    {courses.reduce((sum, c) => sum + (c.credits || 0), 0)} Credits
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons: ElevatedButton (Save) and OutlinedButton (Cancel) */}
          <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-zinc-800 mt-6">
            <button
              onClick={handleSave}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-5 h-5" />
              <span>Save Profile Changes & Return to Screen 1</span>
            </button>

            <button
              onClick={onPop}
              className={`w-full py-3 px-6 rounded-2xl font-semibold text-xs border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Cancel (Discard Changes)
            </button>
          </div>

        </div>

        <div className="mt-4 text-center text-xs text-slate-500 dark:text-zinc-500 font-mono">
          Navigator.pop(context, updatedStudentProfile)
        </div>
      </main>
    </div>
  );
};
