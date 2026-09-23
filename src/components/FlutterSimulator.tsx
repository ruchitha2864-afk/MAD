import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  Moon, 
  Sun, 
  Smartphone, 
  Tablet, 
  Maximize2, 
  Layers, 
  Sparkles, 
  User, 
  BookOpen, 
  X,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { StudentData, sampleAvatars } from '../data/flutterCode';

interface FlutterSimulatorProps {
  student: StudentData;
  onUpdateStudentName: (newName: string) => void;
  onSelectAvatar: (avatar: typeof sampleAvatars[0]) => void;
  activeScreen: 1 | 2;
  setActiveScreen: (screen: 1 | 2) => void;
  highlightedWidget?: string | null;
  onSelectWidget?: (widgetId: string) => void;
}

export const FlutterSimulator: React.FC<FlutterSimulatorProps> = ({
  student,
  onUpdateStudentName,
  onSelectAvatar,
  activeScreen,
  setActiveScreen,
  highlightedWidget,
  onSelectWidget,
}) => {
  // Simulator internal state
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet' | 'frameless'>('phone');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [showLog, setShowLog] = useState<boolean>(false);
  
  // Screen 2 Form state
  const [inputName, setInputName] = useState<string>(student.name);
  const [inputError, setInputError] = useState<string>('');
  
  // SnackBar state on Screen 1
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

  // Navigation log events
  const [navLogs, setNavLogs] = useState<Array<{ time: string; event: string; detail: string }>>([
    {
      time: '00:00:01',
      event: 'MaterialApp Initialized',
      detail: 'Navigator stack set to [StudentProfileScreen]',
    },
  ]);

  // Sync inputName when student.name changes from outside
  useEffect(() => {
    setInputName(student.name);
  }, [student.name]);

  const addLog = (event: string, detail: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setNavLogs(prev => [{ time: timeStr, event, detail }, ...prev.slice(0, 9)]);
  };

  // Screen 1 -> Screen 2: Navigator.push()
  const handleNavigateToEdit = () => {
    setInputName(student.name);
    setInputError('');
    setActiveScreen(2);
    addLog(
      'Navigator.push<String>()',
      'Pushed MaterialPageRoute(builder: (_) => EditProfileScreen) onto stack'
    );
  };

  // Screen 2 -> Screen 1: Navigator.pop(context, updatedName)
  const handleSaveAndReturn = () => {
    const trimmed = inputName.trim();
    if (!trimmed) {
      setInputError('Please enter a valid student name');
      return;
    }
    if (trimmed.length < 2) {
      setInputError('Name must be at least 2 characters');
      return;
    }

    // Call update
    onUpdateStudentName(trimmed);
    setActiveScreen(1);

    addLog(
      'Navigator.pop(context, result)',
      `Popped with return value: "${trimmed}". Screen 1 calls setState()`
    );

    // Show Flutter SnackBar
    setSnackbarMessage(`Student name updated to "${trimmed}"`);
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3800);
  };

  // Cancel edit without returning data: Navigator.pop(context)
  const handleCancel = () => {
    setActiveScreen(1);
    setInputName(student.name);
    setInputError('');
    addLog('Navigator.pop(context)', 'Popped with null (no changes saved)');
  };

  // Quick Preset Name chips for instant testing
  const presetNames = [
    'Dr. Samantha Vance, PhD',
    'Alex Rivera, B.Tech',
    'Priya Sharma',
    'Marcus Alexander Chen',
    'Elena Rostova',
  ];

  const currentTime = '9:41';

  // Helper widget boundary styling
  const getWidgetClass = (widgetId: string) => {
    if (!showInspector) return '';
    const isSelected = highlightedWidget === widgetId;
    return `relative transition-all duration-200 outline-2 ${
      isSelected 
        ? 'outline-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/20' 
        : 'outline-dashed outline-indigo-400/60 hover:outline-indigo-400 hover:bg-indigo-500/5'
    }`;
  };

  const getWidgetTag = (name: string, id: string) => {
    if (!showInspector) return null;
    const isSelected = highlightedWidget === id;
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          onSelectWidget?.(id);
        }}
        className={`absolute -top-3 left-2 z-30 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded cursor-pointer transition-colors shadow-sm ${
          isSelected
            ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-300'
            : 'bg-indigo-600 text-white hover:bg-indigo-500'
        }`}
      >
        {name}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/60 rounded-2xl border border-slate-800 p-4 md:p-6 backdrop-blur-md">
      {/* Simulator Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs font-medium text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Flutter Engine 3.24 (Material 3)
          </div>

          <div className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5 ml-2 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Stack: {activeScreen === 1 ? '[ ProfileScreen ]' : '[ ProfileScreen, EditScreen ]'}
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          {/* Inspector Toggle */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            title="Toggle Flutter Widget Inspector"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              showInspector
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Widget Inspector</span>
          </button>

          {/* Theme Toggle (Light / Dark Flutter theme) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Flutter Material 3 Theme"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Device Frame Modes */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setDeviceType('phone')}
              title="Smartphone View"
              className={`p-1.5 rounded ${deviceType === 'phone' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceType('tablet')}
              title="Tablet View"
              className={`p-1.5 rounded ${deviceType === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceType('frameless')}
              title="Frameless View"
              className={`p-1.5 rounded ${deviceType === 'frameless' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Body Canvas */}
      <div className="flex-1 flex items-center justify-center min-h-[580px] overflow-hidden relative">
        {/* Device Frame */}
        <div
          className={`transition-all duration-300 relative flex flex-col shadow-2xl ${
            deviceType === 'phone'
              ? 'w-[360px] h-[640px] max-w-full rounded-[44px] border-[10px] border-slate-800 ring-1 ring-slate-700/50'
              : deviceType === 'tablet'
              ? 'w-[520px] h-[660px] max-w-full rounded-[36px] border-[12px] border-slate-800 ring-1 ring-slate-700/50'
              : 'w-full h-full max-w-[480px] min-h-[560px] rounded-2xl border border-slate-700'
          } ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'} overflow-hidden select-none font-sans`}
        >
          {/* Phone Top Notch / Dynamic Island (only in phone mode) */}
          {deviceType === 'phone' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-2xl z-40 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950 mr-3 border border-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
          )}

          {/* Flutter Mobile Status Bar */}
          <div
            className={`h-7 px-6 flex items-center justify-between text-[11px] font-semibold tracking-tight z-30 pt-1 ${
              isDarkMode ? 'text-zinc-400' : 'text-slate-600'
            }`}
          >
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[10px] font-mono">5G</span>
              <div className="w-4 h-2 rounded-sm border border-current p-0.5 flex items-center">
                <div className="h-full w-full bg-current rounded-xs" />
              </div>
            </div>
          </div>

          {/* Flutter App Canvas & Navigator Route Container */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {/* ========================================================= */}
            {/* SCREEN 1: Student Profile Screen */}
            {/* ========================================================= */}
            <div
              className={`absolute inset-0 flex flex-col transition-all duration-300 ease-out ${
                activeScreen === 1
                  ? 'translate-x-0 opacity-100 pointer-events-auto'
                  : '-translate-x-16 opacity-0 pointer-events-none'
              } ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}
            >
              {/* Flutter Scaffold AppBar */}
              <div
                className={`${getWidgetClass('screen1_appbar')} h-14 px-4 flex items-center justify-between shadow-xs border-b ${
                  isDarkMode 
                    ? 'bg-zinc-850 border-zinc-800 text-zinc-100' 
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {getWidgetTag('AppBar', 'screen1_appbar')}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h1 className="text-base font-bold tracking-tight">Student Profile</h1>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onUpdateStudentName('Samantha Vance');
                      setSnackbarMessage('Reset to initial student data');
                      setSnackbarVisible(true);
                      setTimeout(() => setSnackbarVisible(false), 2500);
                    }}
                    title="Reset to default student"
                    className="p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Flutter Scaffold Body: Center -> SingleChildScrollView -> Column */}
              <div
                className={`${getWidgetClass('screen1_scaffold')} flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center justify-center`}
              >
                {getWidgetTag('Scaffold / Body', 'screen1_scaffold')}

                <div
                  className={`${getWidgetClass('screen1_column')} w-full flex flex-col items-center text-center`}
                >
                  {getWidgetTag('Column', 'screen1_column')}

                  {/* 1. CircleAvatar Widget */}
                  <div className={`${getWidgetClass('circle_avatar')} relative mb-5`}>
                    {getWidgetTag('CircleAvatar', 'circle_avatar')}
                    <div className="relative group">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-xl border-4 border-white dark:border-zinc-800 ring-2 ring-indigo-500/40"
                      />
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium cursor-pointer">
                        Change Photo
                      </div>
                    </div>

                    {/* Verified Student Badge */}
                    <div className="absolute bottom-1 right-1 bg-indigo-600 text-white rounded-full p-1.5 shadow-md border-2 border-white dark:border-zinc-900">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 2. Text Widget - Student Name */}
                  <div className={`${getWidgetClass('text_name')} mb-1.5`}>
                    {getWidgetTag('Text (Name)', 'text_name')}
                    <h2
                      className={`text-2xl font-bold tracking-tight px-3 py-1 rounded-lg transition-colors ${
                        isDarkMode ? 'text-zinc-50' : 'text-slate-900'
                      }`}
                    >
                      {student.name}
                    </h2>
                  </div>

                  {/* 3. Text Widget - Student Course */}
                  <div className={`${getWidgetClass('text_course')} mb-4 max-w-[280px]`}>
                    {getWidgetTag('Text (Course)', 'text_course')}
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {student.course}
                    </p>
                  </div>

                  {/* Supplemental Student Meta Badge (Department & ID) */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 text-xs text-slate-500 dark:text-zinc-400">
                    <span className="px-2.5 py-1 bg-slate-200/60 dark:bg-zinc-800 rounded-full font-mono">
                      {student.id}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 rounded-full font-medium">
                      {student.semester}
                    </span>
                  </div>

                  {/* 4. ElevatedButton Widget - Navigates to Screen 2 */}
                  <div className={`${getWidgetClass('screen1_btn')} w-full max-w-[260px]`}>
                    {getWidgetTag('ElevatedButton', 'screen1_btn')}
                    <button
                      onClick={handleNavigateToEdit}
                      className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white flex items-center justify-center gap-2 transition-all cursor-pointer group"
                    >
                      <User className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>Edit Student Name</span>
                    </button>
                  </div>

                  <p className="mt-3 text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                    Navigator.push(context, MaterialPageRoute(...))
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* SCREEN 2: Edit Profile Screen */}
            {/* ========================================================= */}
            <div
              className={`absolute inset-0 flex flex-col transition-all duration-300 ease-out ${
                activeScreen === 2
                  ? 'translate-x-0 opacity-100 pointer-events-auto'
                  : 'translate-x-full opacity-0 pointer-events-none'
              } ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}
            >
              {/* Flutter Scaffold AppBar with Back Button */}
              <div
                className={`${getWidgetClass('screen2_appbar')} h-14 px-3 flex items-center justify-between shadow-xs border-b ${
                  isDarkMode 
                    ? 'bg-zinc-850 border-zinc-800 text-zinc-100' 
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {getWidgetTag('AppBar (with BackButton)', 'screen2_appbar')}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    title="Pop route without saving"
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-base font-bold tracking-tight">Edit Profile</h1>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                  Screen 2
                </span>
              </div>

              {/* Flutter Scaffold Body with Form & TextField */}
              <div
                className={`${getWidgetClass('screen2_scaffold')} flex-1 overflow-y-auto px-6 py-6 flex flex-col`}
              >
                {getWidgetTag('Scaffold / Form', 'screen2_scaffold')}

                <div
                  className={`${getWidgetClass('screen2_column')} flex-1 flex flex-col justify-between`}
                >
                  {getWidgetTag('Column (Form)', 'screen2_column')}

                  <div>
                    <div className="mb-4">
                      <h3
                        className={`text-lg font-bold tracking-tight ${
                          isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                        }`}
                      >
                        Update Student Details
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                        Screen 2 accepts input via <code className="text-indigo-400">TextField</code> and returns the new name to Screen 1 via <code className="text-indigo-400">Navigator.pop(context, name)</code>.
                      </p>
                    </div>

                    {/* Flutter TextField Widget */}
                    <div className={`${getWidgetClass('text_field')} mb-4`}>
                      {getWidgetTag('TextField / TextFormField', 'text_field')}
                      <label
                        className={`block text-xs font-semibold mb-1.5 ${
                          isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                        }`}
                      >
                        Student Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={inputName}
                          onChange={(e) => {
                            setInputName(e.target.value);
                            if (inputError) setInputError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveAndReturn();
                          }}
                          placeholder="Enter student name..."
                          autoFocus
                          className={`w-full px-4 py-3 pl-10 pr-10 text-sm rounded-xl border transition-all outline-none font-medium ${
                            inputError
                              ? 'border-red-500 bg-red-50/10 focus:ring-2 focus:ring-red-400'
                              : isDarkMode
                              ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                              : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                          }`}
                        />
                        <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        {inputName && (
                          <button
                            onClick={() => setInputName('')}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Error text or character counter */}
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        {inputError ? (
                          <span className="text-red-500 font-medium">{inputError}</span>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-500">
                            Managed by TextEditingController
                          </span>
                        )}
                        <span className="text-slate-400 dark:text-zinc-500 font-mono">
                          {inputName.length} chars
                        </span>
                      </div>
                    </div>

                    {/* Quick Suggestions for fast testing */}
                    <div className="mb-6">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        Quick Preset Test Names:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {presetNames.map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setInputName(name);
                              setInputError('');
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-slate-300 transition-colors"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: ElevatedButton (Save) and Cancel */}
                  <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className={`${getWidgetClass('screen2_btn')}`}>
                      {getWidgetTag('ElevatedButton (Save)', 'screen2_btn')}
                      <button
                        onClick={handleSaveAndReturn}
                        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save & Return to Screen 1</span>
                      </button>
                    </div>

                    <button
                      onClick={handleCancel}
                      className="w-full py-2.5 px-6 rounded-xl font-medium text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      Cancel (Discard Changes)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Flutter SnackBar simulation on Screen 1 */}
            {snackbarVisible && activeScreen === 1 && (
              <div className="absolute bottom-4 left-4 right-4 z-40 bg-zinc-900 text-zinc-100 rounded-xl p-3.5 shadow-2xl border border-zinc-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div className="flex items-center gap-2.5 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{snackbarMessage}</span>
                </div>
                <button
                  onClick={() => setSnackbarVisible(false)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-1 py-0.5"
                >
                  DISMISS
                </button>
              </div>
            )}
          </div>

          {/* Device Home Indicator Bar */}
          <div className="h-4 flex items-center justify-center pb-1">
            <div
              className={`w-28 h-1 rounded-full ${
                isDarkMode ? 'bg-zinc-700' : 'bg-slate-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Simulator Bottom Avatar Switcher & Status Log */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Preset Student Avatars */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Test Avatars:</span>
          <div className="flex items-center gap-1.5">
            {sampleAvatars.map((av) => (
              <button
                key={av.name}
                onClick={() => onSelectAvatar(av)}
                title={`Switch to ${av.name} (${av.course})`}
                className={`relative rounded-full transition-transform hover:scale-110 p-0.5 ${
                  student.name === av.name ? 'ring-2 ring-indigo-500 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={av.url}
                  alt={av.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Logs Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLog(!showLog)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Navigator Log ({navLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Modal / Flyout for Navigation Event Logs */}
      {showLog && (
        <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-400 font-semibold">Flutter Navigation Stack Activity:</span>
            <button
              onClick={() => setShowLog(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {navLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className="text-emerald-400 shrink-0">{log.event}:</span>
                <span className="text-slate-400 truncate">{log.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
