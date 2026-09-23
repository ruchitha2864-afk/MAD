import React from 'react';
import { 
  GraduationCap, 
  Edit3, 
  Award, 
  BookOpen, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  FileCode2, 
  Moon, 
  Sun, 
  Camera, 
  FlaskConical,
  UserPlus
} from 'lucide-react';
import { StudentProfile, avatarPresets } from '../types/student';
import { FlutterCircleAvatar } from '../components/FlutterCircleAvatar';
import { EditTab } from './EditProfileScreen';

interface StudentProfileScreenProps {
  student: StudentProfile;
  onNavigateToEdit: (tab?: EditTab) => void;
  onNavigateToRegister: () => void;
  onSelectAvatarPreset: (preset: typeof avatarPresets[0]) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenArchitectureModal: () => void;
  onOpenTestRunner: () => void;
}

export const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({
  student,
  onNavigateToEdit,
  onNavigateToRegister,
  onSelectAvatarPreset,
  isDarkMode,
  onToggleTheme,
  onOpenArchitectureModal,
  onOpenTestRunner,
}) => {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              {/* Flutter Widget: Text (AppBar Title) */}
              <h1 className="text-lg font-bold tracking-tight">Student Profile</h1>
              <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
                Academic Portal • Screen 1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Register Student Action */}
            <button
              onClick={onNavigateToRegister}
              title="Register a new student record"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>

            {/* Test Runner Action */}
            <button
              onClick={onOpenTestRunner}
              title="Run Automated Tests"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Run Tests</span>
            </button>

            {/* Dark/Light Theme Action */}
            <button
              onClick={onToggleTheme}
              title="Toggle Material 3 Theme"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 border-zinc-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Architecture / Dart Code Inspector */}
            <button
              onClick={onOpenArchitectureModal}
              title="View Flutter Widget Hierarchy & Dart Code"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 transition-all cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flutter Architecture</span>
            </button>
          </div>
        </div>
      </header>

      {/* Flutter Widget: Scaffold Body with SingleChildScrollView + Center + Padding */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {/* Flutter Widget: Column */}
        <div className="flex flex-col items-center w-full">
          
          {/* Top Profile Card Container */}
          <div className={`w-full rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
            isDarkMode 
              ? 'bg-zinc-900/90 border-zinc-800 shadow-black/40' 
              : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}>
            <div className="flex flex-col items-center text-center">
              {/* 1. Flutter Widget: CircleAvatar wrapped in InkWell / GestureDetector */}
              <div className="relative mb-5 group cursor-pointer" onClick={() => onNavigateToEdit('personal')}>
                <FlutterCircleAvatar
                  photoUrl={student.photoUrl}
                  name={student.name}
                  size="lg"
                  showBadge={true}
                />
                <button
                  type="button"
                  title="Change Profile Photo (Screen 2)"
                  className="absolute bottom-1 right-1 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg border-2 border-white dark:border-zinc-900 transition-transform group-hover:scale-110 flex items-center justify-center cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Flutter Widget: Text (Student Name) */}
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5 transition-colors ${
                isDarkMode ? 'text-zinc-50' : 'text-slate-900'
              }`}>
                {student.name}
              </h2>

              {/* 3. Flutter Widget: Text (Student Course) */}
              <p className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3 max-w-lg leading-relaxed">
                {student.course}
              </p>

              {/* Academic Tags & Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs">
                <span className="px-3 py-1 rounded-full font-mono font-semibold bg-slate-200/70 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  ID: {student.id}
                </span>
                <span className="px-3 py-1 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  {student.semester}
                </span>
                <span className="px-3 py-1 rounded-full font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {student.status}
                </span>
              </div>

              {/* 4. Flutter Widget: ElevatedButton (Navigates to Screen 2) */}
              <button
                onClick={() => onNavigateToEdit('personal')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer group"
              >
                <Edit3 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>Edit Student Profile (Screen 2)</span>
                <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                Flutter Navigator.push(context, MaterialPageRoute(...))
              </span>
            </div>
          </div>

          {/* Academic Highlights Header & Grid with Edit Button */}
          <div className="w-full mt-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span>Academic Performance Metrics</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateToEdit('stats')}
                title="Edit cumulative GPA, credits, and attendance rate"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Stats</span>
              </button>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => onNavigateToEdit('stats')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:border-indigo-400/50 hover:shadow-md ${
                  isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-indigo-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Cumulative GPA
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-zinc-100">
                  {student.gpa.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 4.00</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center justify-between">
                  <span>Top 5% of Department</span>
                  <span className="text-[10px] text-indigo-500 underline opacity-0 group-hover:opacity-100">Edit</span>
                </p>
              </div>

              <div 
                onClick={() => onNavigateToEdit('stats')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:border-indigo-400/50 hover:shadow-md ${
                  isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-indigo-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Credits Completed
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-zinc-100">
                  {student.completedCredits} <span className="text-xs font-normal text-slate-400">/ {student.totalCredits}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 flex items-center justify-between">
                  <span>{Math.round((student.completedCredits / (student.totalCredits || 120)) * 100)}% Degree Progress</span>
                  <span className="text-[10px] text-indigo-500 underline opacity-0 group-hover:opacity-100">Edit</span>
                </p>
              </div>

              <div 
                onClick={() => onNavigateToEdit('stats')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:border-indigo-400/50 hover:shadow-md ${
                  isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-indigo-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Attendance Rate
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-zinc-100">
                  {student.attendanceRate}%
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center justify-between">
                  <span>Excellent Standing</span>
                  <span className="text-[10px] text-indigo-500 underline opacity-0 group-hover:opacity-100">Edit</span>
                </p>
              </div>
            </div>
          </div>

          {/* Student Detailed Information & Enrolled Courses */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Student Metadata Card */}
            <div className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-zinc-100">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>Department & Contact Information</span>
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigateToEdit('contact')}
                  title="Edit department, email, phone, and advisor"
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Contact</span>
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Department:</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{student.department}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Institutional Email:</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{student.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Phone:</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{student.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Academic Advisor:</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{student.advisor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Subjects Card */}
            <div className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-zinc-100">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>Currently Enrolled Courses (Semester 5)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigateToEdit('courses')}
                  title="Edit enrolled courses, grades, credits and instructors"
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Courses</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {student.enrolledCourses.map((c) => (
                  <div
                    key={c.code}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      isDarkMode
                        ? 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                        : 'bg-slate-50 border-slate-200/80 hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">
                          {c.code}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-zinc-200">
                          {c.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {c.instructor} • {c.credits} Credits
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                      {c.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Avatar Presets */}
          <div className="w-full mt-6 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              Switch Sample Student Profile:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateToRegister}
                title="Register a new student"
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/20 transition-all cursor-pointer"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ Register New</span>
              </button>

              {avatarPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onSelectAvatarPreset(preset)}
                  title={`Load ${preset.name}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                    student.name === preset.name
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : isDarkMode
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <img src={preset.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                  <span className="text-[11px] font-medium">{preset.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
