import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Search, 
  Terminal, 
  ExternalLink,
  Code2,
  FileText
} from 'lucide-react';
import { generateFlutterDartCode, pubspecYamlContent } from '../data/flutterCode';

interface CodeViewerProps {
  studentName: string;
  studentCourse: string;
  photoUrl: string;
  highlightedKeyword?: string | null;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  studentName,
  studentCourse,
  photoUrl,
  highlightedKeyword,
}) => {
  const [activeTab, setActiveTab] = useState<'main.dart' | 'pubspec.yaml' | 'run'>('main.dart');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const dartCode = generateFlutterDartCode(studentName, studentCourse, photoUrl);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Simple syntax colorizer for Dart / Flutter
  const renderHighlightedCode = (rawCode: string) => {
    const lines = rawCode.split('\n');

    return lines.map((line, lineIdx) => {
      const isSearchMatch = searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase());
      const isKeywordMatch = highlightedKeyword && line.includes(highlightedKeyword);

      return (
        <div
          key={lineIdx}
          className={`flex items-start text-xs font-mono py-0.5 px-3 transition-colors ${
            isSearchMatch || isKeywordMatch
              ? 'bg-amber-500/20 text-amber-200 border-l-2 border-amber-400'
              : 'hover:bg-slate-800/40'
          }`}
        >
          <span className="w-9 shrink-0 text-slate-600 select-none text-right pr-4 font-mono text-[11px]">
            {lineIdx + 1}
          </span>
          <span className="flex-1 whitespace-pre leading-5 text-slate-300">
            {formatDartLine(line)}
          </span>
        </div>
      );
    });
  };

  // Lightweight syntax styling helper
  const formatDartLine = (line: string) => {
    // Comments
    if (line.trim().startsWith('//') || line.trim().startsWith('///') || line.trim().startsWith('*')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    // Highlight key Flutter widgets in different colors
    const flutterWidgets = [
      'Scaffold',
      'AppBar',
      'Column',
      'CircleAvatar',
      'Text',
      'ElevatedButton',
      'TextField',
      'TextFormField',
      'Navigator',
      'MaterialPageRoute',
      'MaterialApp',
      'SingleChildScrollView',
      'Center',
      'Padding',
      'SizedBox',
      'Icon',
      'IconButton',
      'OutlinedButton',
      'SnackBar',
      'ScaffoldMessenger',
    ];

    // Splitting tokens while preserving delimiters
    const parts = line.split(/([A-Za-z0-9_]+|[^\sA-Za-z0-9_]+|\s+)/).filter(Boolean);

    return parts.map((part, i) => {
      if (flutterWidgets.includes(part)) {
        return (
          <span key={i} className="text-cyan-400 font-semibold underline decoration-cyan-500/30">
            {part}
          </span>
        );
      }
      if (['class', 'extends', 'super', 'const', 'final', 'late', 'return', 'import', 'void', 'async', 'await', 'if', 'else', 'new'].includes(part)) {
        return (
          <span key={i} className="text-purple-400 font-semibold">
            {part}
          </span>
        );
      }
      if (['String', 'Widget', 'BuildContext', 'State', 'StatefulWidget', 'StatelessWidget', 'Future', 'TextEditingController', 'GlobalKey', 'ThemeData', 'ColorScheme'].includes(part)) {
        return (
          <span key={i} className="text-amber-300">
            {part}
          </span>
        );
      }
      if (['setState', 'push', 'pop', 'showSnackBar', 'validate', 'trim', 'runApp', 'dispose', 'initState'].includes(part)) {
        return (
          <span key={i} className="text-blue-400 font-medium">
            {part}
          </span>
        );
      }
      if (part.startsWith("'") || part.startsWith('"') || part.endsWith("'") || part.endsWith('"')) {
        return (
          <span key={i} className="text-emerald-300">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 rounded-2xl border border-slate-800 backdrop-blur-md overflow-hidden">
      {/* Header bar with tabs and actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('main.dart')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'main.dart'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-300" />
            <span>lib/main.dart</span>
          </button>

          <button
            onClick={() => setActiveTab('pubspec.yaml')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pubspec.yaml'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>pubspec.yaml</span>
          </button>

          <button
            onClick={() => setActiveTab('run')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'run'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-300" />
            <span>How to Run</span>
          </button>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'main.dart' && (
            <div className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search widgets (e.g. Navigator)..."
                className="w-48 px-2.5 py-1 pl-7 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            </div>
          )}

          <button
            onClick={() =>
              handleCopy(
                activeTab === 'main.dart'
                  ? dartCode
                  : activeTab === 'pubspec.yaml'
                  ? pubspecYamlContent
                  : `flutter create student_profile_app\ncd student_profile_app\nflutter run`
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          {activeTab === 'main.dart' && (
            <button
              onClick={() => handleDownload('main.dart', dartCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
              title="Download main.dart"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Code / Content Area */}
      <div className="flex-1 overflow-auto bg-slate-950 p-2 font-mono">
        {activeTab === 'main.dart' && (
          <div className="py-2">{renderHighlightedCode(dartCode)}</div>
        )}

        {activeTab === 'pubspec.yaml' && (
          <div className="p-4 text-xs font-mono text-slate-300 leading-6 whitespace-pre">
            {pubspecYamlContent}
          </div>
        )}

        {activeTab === 'run' && (
          <div className="p-5 text-sm text-slate-300 space-y-4 font-sans">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
              <Terminal className="w-5 h-5" />
              <span>Running this Flutter app on your machine</span>
            </div>

            <p className="text-xs text-slate-400">
              Follow these standard Flutter CLI commands to test this app on iOS, Android, macOS, Windows, or Web:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1 font-sans">1. Create a new Flutter project:</span>
                <span className="text-emerald-400">flutter create student_profile_app</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1 font-sans">2. Navigate into the project folder:</span>
                <span className="text-emerald-400">cd student_profile_app</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1 font-sans">3. Replace lib/main.dart with the code from the "main.dart" tab:</span>
                <span className="text-slate-400">Copy or download the complete code above into your local <code className="text-indigo-400">lib/main.dart</code></span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1 font-sans">4. Run the app on an emulator, connected phone, or Chrome:</span>
                <span className="text-emerald-400">flutter run -d chrome</span>
                <span className="text-slate-500 text-[11px] block mt-1">or run on Android/iOS emulator: <code className="text-slate-300">flutter run</code></span>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
              <p className="font-semibold mb-1">Key Flutter Concepts Used:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><strong className="text-indigo-300">Scaffold:</strong> Foundation structure providing AppBar & Body layout.</li>
                <li><strong className="text-indigo-300">Navigator.push:</strong> Launches Screen 2 and waits for a returned Future.</li>
                <li><strong className="text-indigo-300">Navigator.pop:</strong> Returns the updated name back to Screen 1.</li>
                <li><strong className="text-indigo-300">setState:</strong> Rebuilds the UI on Screen 1 with the newly received student name.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer quick widget badges */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-300">Specified Widgets:</span>
          {['Scaffold', 'AppBar', 'Column', 'CircleAvatar', 'Text', 'ElevatedButton', 'TextField', 'Navigator'].map((w) => (
            <span
              key={w}
              onClick={() => setSearchQuery(w)}
              className="px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded cursor-pointer font-mono transition-colors"
            >
              {w}
            </span>
          ))}
        </div>
        <div className="font-mono text-slate-500">Dart 3.x / Null-Safe</div>
      </div>
    </div>
  );
};
