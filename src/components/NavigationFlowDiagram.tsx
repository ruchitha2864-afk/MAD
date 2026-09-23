import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  CornerDownRight, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface NavigationFlowDiagramProps {
  onTestFlow: () => void;
  activeScreen: 1 | 2;
}

export const NavigationFlowDiagram: React.FC<NavigationFlowDiagramProps> = ({
  onTestFlow,
  activeScreen,
}) => {
  return (
    <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Flutter Navigator 2-Screen Data Passing Flow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            How data flows between Screen 1 and Screen 2 using <code className="text-indigo-300 font-mono">Navigator.push</code> and <code className="text-indigo-300 font-mono">Navigator.pop</code>.
          </p>
        </div>

        <button
          onClick={onTestFlow}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Test Flow in Simulator</span>
        </button>
      </div>

      {/* Visual Sequence of the Flutter Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Screen 1 initiates Push */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeScreen === 1
              ? 'bg-indigo-950/30 border-indigo-500/40 ring-1 ring-indigo-500/30'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-wider font-mono">
              Step 1: Screen 1
            </span>
            <span className="text-xs text-slate-400 font-mono">Navigator.push()</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 mb-1">
            StudentProfileScreen (StatefulWidget)
          </h4>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            The user taps the <code className="text-indigo-300 font-mono">ElevatedButton</code>. Screen 1 pushes <code className="text-indigo-300 font-mono">EditProfileScreen</code> and awaits a Future string.
          </p>

          <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800/80">
            <span className="text-purple-400">final</span> updatedName = <br />
            &nbsp;&nbsp;<span className="text-purple-400">await</span> Navigator.<span className="text-blue-400">push</span>&lt;<span className="text-amber-300">String</span>&gt;(<br />
            &nbsp;&nbsp;&nbsp;&nbsp;context,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">MaterialPageRoute</span>(<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;builder: (c) =&gt; <span className="text-amber-300">EditProfileScreen</span>(currentName: _studentName),<br />
            &nbsp;&nbsp;&nbsp;&nbsp;),<br />
            &nbsp;&nbsp;);
          </div>
        </div>

        {/* Step 2: Screen 2 edits & pops */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeScreen === 2
              ? 'bg-amber-950/30 border-amber-500/40 ring-1 ring-amber-500/30'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase tracking-wider font-mono">
              Step 2: Screen 2
            </span>
            <span className="text-xs text-slate-400 font-mono">Navigator.pop()</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 mb-1">
            EditProfileScreen (StatefulWidget)
          </h4>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            The user edits their name in the <code className="text-amber-300 font-mono">TextField</code> and taps "Save Changes". Screen 2 pops off the Navigator stack, returning the value.
          </p>

          <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800/80">
            <span className="text-slate-500">// Returns new name back to caller</span><br />
            <span className="text-purple-400">final</span> newName = _nameController.text.trim();<br />
            Navigator.<span className="text-blue-400">pop</span>(context, newName);
          </div>
        </div>

        {/* Step 3: Screen 1 updates state with setState() */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeScreen === 1
              ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wider font-mono">
              Step 3: State Rebuild
            </span>
            <span className="text-xs text-slate-400 font-mono">setState()</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 mb-1">
            UI Re-render & SnackBar
          </h4>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            The Future in Screen 1 finishes with the new name. Calling <code className="text-emerald-300 font-mono">setState()</code> triggers a Flutter build pass, updating the Text widget.
          </p>

          <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800/80">
            <span className="text-purple-400">if</span> (updatedName != <span className="text-purple-400">null</span>) &#123;<br />
            &nbsp;&nbsp;<span className="text-blue-400">setState</span>(() &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;_studentName = updatedName;<br />
            &nbsp;&nbsp;&#125;);<br />
            &nbsp;&nbsp;<span className="text-slate-500">// Optional SnackBar feedback</span><br />
            &#125;
          </div>
        </div>
      </div>
    </div>
  );
};
