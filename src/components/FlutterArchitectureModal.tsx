import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Layers, 
  GitBranch, 
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { generateFlutterDartCode, pubspecYamlContent } from '../data/flutterCode';

interface FlutterArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentCourse: string;
  photoUrl: string;
  isDarkMode: boolean;
}

export const FlutterArchitectureModal: React.FC<FlutterArchitectureModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentCourse,
  photoUrl,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'dart' | 'widgets' | 'flow'>('dart');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const dartCode = generateFlutterDartCode(studentName, studentCourse, photoUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(dartCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([dartCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'main.dart';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Flutter Architecture & Dart Code</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Two-Screen Student Profile implementation in Flutter (Material 3)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-zinc-950/60 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('dart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'dart'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>main.dart</span>
            </button>

            <button
              onClick={() => setActiveTab('widgets')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'widgets'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Widget Tree Hierarchy</span>
            </button>

            <button
              onClick={() => setActiveTab('flow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'flow'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Navigator Flow</span>
            </button>
          </div>

          {activeTab === 'dart' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download main.dart</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs">
          {activeTab === 'dart' && (
            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 overflow-x-auto leading-relaxed border border-slate-800">
              <code>{dartCode}</code>
            </pre>
          )}

          {activeTab === 'widgets' && (
            <div className="font-sans space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                  Flutter Architecture Widget Mapping:
                </span>
                Every requirement requested by the user is structured with its authentic Flutter counterpart:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block">
                    Screen 1: StudentProfileScreen
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>Scaffold</code> (base page layout)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>AppBar</code> (Title: "Student Profile")</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>SingleChildScrollView</code> + <code>Center</code></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>Column</code> (vertical layout hierarchy)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>CircleAvatar</code> (student photo)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>Text</code> (student's name)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>Text</code> (student's course)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>ElevatedButton</code> (calls Navigator.push)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block">
                    Screen 2: EditProfileScreen
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>Scaffold</code> (base page layout)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>AppBar</code> (with automatic BackButton)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>Column</code> (form elements layout)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>TextField</code> / <code>TextFormField</code> (edits name)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>ElevatedButton</code> (calls Navigator.pop)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <code>Navigator.pop(context, updatedName)</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="font-sans space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-3">
                <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                  Navigator Push & Pop Sequence
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                  <span className="text-slate-500">// Screen 1 pushes Screen 2 and awaits Future:</span><br />
                  <span className="text-purple-400">final</span> updatedName = <span className="text-purple-400">await</span> Navigator.<span className="text-blue-400">push</span>&lt;<span className="text-amber-300">String</span>&gt;(<br />
                  &nbsp;&nbsp;context,<br />
                  &nbsp;&nbsp;<span className="text-cyan-400">MaterialPageRoute</span>(builder: (c) =&gt; <span className="text-amber-300">EditProfileScreen</span>(currentName: _studentName)),<br />
                  );<br /><br />
                  <span className="text-slate-500">// Screen 2 pops and passes back the new name:</span><br />
                  Navigator.<span className="text-blue-400">pop</span>(context, _nameController.text.trim());<br /><br />
                  <span className="text-slate-500">// Screen 1 receives value and triggers UI rebuild:</span><br />
                  <span className="text-purple-400">if</span> (updatedName != <span className="text-purple-400">null</span>) &#123;<br />
                  &nbsp;&nbsp;<span className="text-blue-400">setState</span>(() =&gt; _studentName = updatedName);<br />
                  &#125;
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
