import React, { useState } from 'react';
import { 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Info, 
  Code, 
  Sparkles, 
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { widgetHierarchy, WidgetNode } from '../data/widgetTree';

interface WidgetTreeVisualizerProps {
  onHighlightWidget: (id: string) => void;
  activeScreen: 1 | 2;
  setActiveScreen: (screen: 1 | 2) => void;
}

export const WidgetTreeVisualizer: React.FC<WidgetTreeVisualizerProps> = ({
  onHighlightWidget,
  activeScreen,
  setActiveScreen,
}) => {
  const [selectedNode, setSelectedNode] = useState<WidgetNode>(widgetHierarchy);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    app: true,
    navigator: true,
    screen1_scaffold: true,
    screen1_column: true,
    screen2_scaffold: true,
    screen2_column: true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectNode = (node: WidgetNode) => {
    setSelectedNode(node);
    onHighlightWidget(node.id);
    if (node.screen === 1 && activeScreen !== 1) {
      setActiveScreen(1);
    } else if (node.screen === 2 && activeScreen !== 2) {
      setActiveScreen(2);
    }
  };

  const renderNode = (node: WidgetNode, depth: number = 0) => {
    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedNode.id === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isForActiveScreen = node.screen === 'both' || node.screen === activeScreen;

    const typeBadges: Record<WidgetNode['type'], { label: string; color: string }> = {
      framework: { label: 'Root', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
      navigation: { label: 'Route', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      layout: { label: 'Layout', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
      component: { label: 'Widget', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
      input: { label: 'Input', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    };

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => handleSelectNode(node)}
          style={{ paddingLeft: `${depth * 18 + 8}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer transition-colors text-xs font-mono group my-0.5 ${
            isSelected
              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
              : isForActiveScreen
              ? 'hover:bg-slate-800 text-slate-300'
              : 'opacity-50 hover:opacity-80 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 rounded hover:bg-slate-700/50 text-slate-400 group-hover:text-slate-200"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-600">
                •
              </span>
            )}

            <span className="truncate">{node.name}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {node.screen !== 'both' && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-sans font-bold ${
                  node.screen === 1
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'bg-orange-500/20 text-orange-300'
                }`}
              >
                Screen {node.screen}
              </span>
            )}
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded border font-sans font-medium ${
                typeBadges[node.type].color
              }`}
            >
              {typeBadges[node.type].label}
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-slate-800/80 ml-3.5">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-md">
      {/* Left panel: Widget Tree Hierarchy */}
      <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">Flutter Widget Tree</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Click widget to inspect
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {renderNode(widgetHierarchy)}
        </div>

        <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Active View: Screen {activeScreen}</span>
          <button
            onClick={() => setActiveScreen(activeScreen === 1 ? 2 : 1)}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Switch to Screen {activeScreen === 1 ? 2 : 1}
          </button>
        </div>
      </div>

      {/* Right panel: Widget Inspector Details */}
      <div className="w-full md:w-1/2 p-5 flex flex-col justify-between bg-slate-900/40">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedNode.name}
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {selectedNode.screen === 'both'
                    ? 'Global / Navigation'
                    : `Screen ${selectedNode.screen}`}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200">
                Flutter Widget Documentation
              </h4>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {selectedNode.description}
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Core Role in Flutter
              </span>
              <p className="text-xs text-slate-300">{selectedNode.keyConcept}</p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Code className="w-3 h-3" /> Key Dart Properties & Methods
              </span>
              <ul className="space-y-1 text-xs font-mono text-slate-300">
                {selectedNode.properties.map((prop, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-indigo-400">•</span>
                    <code>{prop}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            In Flutter, "Everything is a Widget". The visual tree combines layouts (<code className="text-slate-300">Scaffold</code>, <code className="text-slate-300">Column</code>) and controls (<code className="text-slate-300">CircleAvatar</code>, <code className="text-slate-300">Text</code>, <code className="text-slate-300">ElevatedButton</code>).
          </span>
        </div>
      </div>
    </div>
  );
};
