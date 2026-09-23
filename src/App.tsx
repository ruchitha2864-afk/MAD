import React, { useState } from 'react';
import { defaultStudent, StudentProfile, avatarPresets } from './types/student';
import { StudentProfileScreen } from './screens/StudentProfileScreen';
import { EditProfileScreen, EditTab } from './screens/EditProfileScreen';
import { StudentRegistrationScreen } from './screens/StudentRegistrationScreen';
import { FlutterArchitectureModal } from './components/FlutterArchitectureModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  // Flutter Application State: _studentName, student course, etc.
  const [student, setStudent] = useState<StudentProfile>(defaultStudent);
  const [previousProfile, setPreviousProfile] = useState<StudentProfile | null>(null);

  // Flutter Navigator Stack simulation: ['/profile'], ['/profile', '/edit'], ['/profile', '/register']
  const [currentRoute, setCurrentRoute] = useState<'/profile' | '/edit' | '/register'>('/profile');
  const [editInitialTab, setEditInitialTab] = useState<EditTab>('personal');
  
  // Flutter SnackBar state
  const [snackbar, setSnackbar] = useState<{ message: string; visible: boolean } | null>(null);

  // Theme Mode (Material 3 Light / Dark)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Architecture inspector modal
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);

  // Test Runner modal
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  // Interactive automated test flow on the UI
  const handleRunInteractiveFlow = (testName: string) => {
    // 1. Push to Screen 2
    setEditInitialTab('personal');
    setCurrentRoute('/edit');
    showSnackBar('Automated Test: Navigated to Screen 2 (Navigator.push)');

    // 2. Automatically save updated profile after 1.5 seconds
    setTimeout(() => {
      handleSaveProfile({
        ...student,
        name: testName,
      });
    }, 1500);
  };

  // Flutter Navigation: Navigator.push(context, MaterialPageRoute(builder: (_) => EditProfileScreen(initialTab: ...)))
  const handleNavigateToEdit = (tab: EditTab = 'personal') => {
    setEditInitialTab(tab);
    setCurrentRoute('/edit');
  };

  // Flutter Navigation: Navigator.push(context, MaterialPageRoute(builder: (_) => StudentRegistrationScreen()))
  const handleNavigateToRegister = () => {
    setCurrentRoute('/register');
  };

  // Flutter Navigation: Navigator.pop(context, newStudentProfile)
  const handleRegisterStudent = (newStudent: StudentProfile) => {
    setPreviousProfile(student);
    setStudent(newStudent);
    setCurrentRoute('/profile');
    showSnackBar(`New Student Registered: "${newStudent.name}" (${newStudent.id})`);
  };

  // Flutter Navigation: Navigator.pop(context, updatedProfileData)
  const handleSaveProfile = (updatedStudent: StudentProfile) => {
    setPreviousProfile(student);
    setStudent(updatedStudent);
    
    // Pop back to Screen 1
    setCurrentRoute('/profile');

    // Show Flutter SnackBar
    showSnackBar(`Student profile updated: "${updatedStudent.name}"`);
  };

  // Flutter Navigation: Navigator.pop(context) without data
  const handlePopWithoutSave = () => {
    setCurrentRoute('/profile');
  };

  // Helper to show floating SnackBar
  const showSnackBar = (message: string) => {
    setSnackbar({ message, visible: true });
    setTimeout(() => {
      setSnackbar(prev => prev ? { ...prev, visible: false } : null);
    }, 4000);
  };

  // Undo student profile change
  const handleUndo = () => {
    if (previousProfile) {
      setStudent(previousProfile);
      showSnackBar(`Restored previous profile: "${previousProfile.name}"`);
      setPreviousProfile(null);
    }
  };

  // Switch student avatar/course preset
  const handleSelectAvatarPreset = (preset: typeof avatarPresets[0]) => {
    setPreviousProfile(student);
    setStudent(prev => ({
      ...prev,
      name: preset.name,
      photoUrl: preset.url,
      course: preset.course,
    }));
    showSnackBar(`Loaded profile: ${preset.name}`);
  };

  return (
    <div className={`min-h-screen font-sans antialiased ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Route Container: Screen 1, Screen 2, or Screen 3 */}
      <div className="w-full min-h-screen">
        {currentRoute === '/profile' && (
          <StudentProfileScreen
            student={student}
            onNavigateToEdit={handleNavigateToEdit}
            onNavigateToRegister={handleNavigateToRegister}
            onSelectAvatarPreset={handleSelectAvatarPreset}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            onOpenArchitectureModal={() => setIsArchModalOpen(true)}
            onOpenTestRunner={() => setIsTestModalOpen(true)}
          />
        )}

        {currentRoute === '/edit' && (
          <EditProfileScreen
            currentName={student.name}
            currentPhotoUrl={student.photoUrl}
            student={student}
            initialTab={editInitialTab}
            onPop={handlePopWithoutSave}
            onSave={handleSaveProfile}
            isDarkMode={isDarkMode}
          />
        )}

        {currentRoute === '/register' && (
          <StudentRegistrationScreen
            onPop={handlePopWithoutSave}
            onRegister={handleRegisterStudent}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* Flutter Floating SnackBar Component */}
      {snackbar && snackbar.visible && currentRoute === '/profile' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 shadow-2xl border border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs font-medium truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{snackbar.message}</span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {previousProfile && (
                <button
                  onClick={handleUndo}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>UNDO</span>
                </button>
              )}
              <button
                onClick={() => setSnackbar(null)}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-200 px-1 py-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flutter Architecture & Dart Code Dialog */}
      <FlutterArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        studentName={student.name}
        studentCourse={student.course}
        photoUrl={student.photoUrl}
        isDarkMode={isDarkMode}
      />

      {/* Flutter Architecture Automated Test Runner Dialog */}
      <TestRunnerModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onRunInteractiveFlow={handleRunInteractiveFlow}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
