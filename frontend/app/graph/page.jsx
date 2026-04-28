'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Network, Users, Rocket, DollarSign, RefreshCw } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { graphService } from '@/services/graphService';

const NODE_COLORS = {
  founder: '#D4AF37',
  investor: '#60A5FA',
  mentor: '#34D399',
  startup: '#A78BFA',
};

const NODE_ICONS = {
  founder: '⚡',
  investor: '💰',
  mentor: '🎯',
  startup: '🚀',
};

const FALLBACK_GRAPH = {
  nodes: [
    { id: 'u1', label: 'Aisha Johnson', type: 'investor', group: 'investor' },
    { id: 'u2', label: 'Priya Sharma', type: 'mentor', group: 'mentor' },
    { id: 'u3', label: 'Sofia Chen', type: 'founder', group: 'founder' },
    { id: 'u4', label: 'Fatima Al-Rashid', type: 'founder', group: 'founder' },
    { id: 'u5', label: 'Yuki Tanaka', type: 'founder', group: 'founder' },
    { id: 'u6', label: 'Maria Santos', type: 'investor', group: 'investor' },
    { id: 's1', label: 'EcoLaunch', type: 'startup', group: 'startup', industry: 'CleanTech' },
    { id: 's2', label: 'MindBridge AI', type: 'startup', group: 'startup', industry: 'HealthTech' },
    { id: 's3', label: 'DataPulse', type: 'startup', group: 'startup', industry: 'SaaS' },
  ],
  edges: [
    { id: 'e1', source: 'u3', target: 's1', label: 'founded' },
    { id: 'e2', source: 'u4', target: 's2', label: 'founded' },
    { id: 'e3', source: 'u5', target: 's3', label: 'founded' },
    { id: 'e4', source: 'u1', target: 's1', label: 'invested' },
    { id: 'e5', source: 'u1', target: 's3', label: 'invested' },
    { id: 'e6', source: 'u6', target: 's2', label: 'invested' },
    { id: 'e7', source: 'u2', target: 'u3', label: 'mentors' },
    { id: 'e8', source: 'u2', target: 'u5', label: 'mentors' },
    { id: 'e9', source: 'u3', target: 'u4', label: 'connected' },
  ],
};

// Simple force-layout using fixed positions spread in a circle
function layoutNodes(nodes, width = 600, height = 480) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.36;
  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    const isCenter = i === 0;
    return {
      ...node,
      x: isCenter ? cx : cx + r * Math.cos(angle),
      y: isCenter ? cy : cy + r * Math.sin(angle),
    };
  });
}

export default function GraphPage() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });
  const containerRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await graphService.getGraph();
      setGraph(data.nodes?.length ? data : FALLBACK_GRAPH);
    } catch (_) {
      setGraph(FALLBACK_GRAPH);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.offsetWidth, height: Math.max(480, containerRef.current.offsetWidth * 0.65) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const positionedNodes = layoutNodes(graph.nodes, dimensions.width, dimensions.height);
  const nodeMap = Object.fromEntries(positionedNodes.map((n) => [n.id, n]));

  const selectedNode = selected ? positionedNodes.find((n) => n.id === selected) : null;
  const connectedEdges = graph.edges.filter((e) => e.source === selected || e.target === selected);
  const connectedIds = new Set(connectedEdges.flatMap((e) => [e.source, e.target]));

  const counts = graph.nodes.reduce((acc, n) => {
    acc[n.group] = (acc[n.group] || 0) + 1;
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-xs font-semibold px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  Network Intelligence
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                Network <span style={{ background: 'linear-gradient(90deg,#D4AF37,#F5C542)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Graph</span>
              </h1>
              <p className="text-slate-400 text-sm">Explore connections between founders, investors, and startups</p>
            </div>
            <button onClick={load}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Founders', key: 'founder', icon: '⚡' },
            { label: 'Investors', key: 'investor', icon: '💰' },
            { label: 'Mentors', key: 'mentor', icon: '🎯' },
            { label: 'Startups', key: 'startup', icon: '🚀' },
          ].map(({ label, key, icon }) => (
            <GlassCard key={key} className="p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xl font-black text-white">{counts[key] || 0}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Graph Canvas */}
          <div className="lg:col-span-2">
            <GlassCard className="p-4 overflow-hidden">
              <div ref={containerRef} className="w-full relative">
                {loading ? (
                  <div className="flex items-center justify-center" style={{ height: dimensions.height }}>
                    <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,55,0.2)] border-t-[#D4AF37] animate-spin" />
                  </div>
                ) : (
                  <svg width="100%" height={dimensions.height} style={{ overflow: 'visible' }}>
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Edges */}
                    {graph.edges.map((edge) => {
                      const src = nodeMap[edge.source];
                      const tgt = nodeMap[edge.target];
                      if (!src || !tgt) return null;
                      const isHighlighted = selected && (edge.source === selected || edge.target === selected);
                      return (
                        <line
                          key={edge.id}
                          x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                          stroke={isHighlighted ? '#D4AF37' : 'rgba(255,255,255,0.08)'}
                          strokeWidth={isHighlighted ? 2 : 1}
                          strokeDasharray={edge.label === 'mentors' ? '4 3' : undefined}
                        />
                      );
                    })}

                    {/* Edge labels */}
                    {selected && connectedEdges.map((edge) => {
                      const src = nodeMap[edge.source];
                      const tgt = nodeMap[edge.target];
                      if (!src || !tgt) return null;
                      const mx = (src.x + tgt.x) / 2;
                      const my = (src.y + tgt.y) / 2;
                      return (
                        <text key={`lbl-${edge.id}`} x={mx} y={my - 6} textAnchor="middle" fill="#D4AF37" fontSize="10" fontWeight="600">
                          {edge.label}
                        </text>
                      );
                    })}

                    {/* Nodes */}
                    {positionedNodes.map((node) => {
                      const color = NODE_COLORS[node.type] || '#888';
                      const isSelected = node.id === selected;
                      const isDimmed = selected && !connectedIds.has(node.id) && node.id !== selected;
                      const radius = node.type === 'startup' ? 20 : 24;
                      return (
                        <g
                          key={node.id}
                          onClick={() => setSelected(node.id === selected ? null : node.id)}
                          style={{ cursor: 'pointer', opacity: isDimmed ? 0.25 : 1, transition: 'opacity 0.2s' }}
                        >
                          {/* Glow ring for selected */}
                          {isSelected && (
                            <circle cx={node.x} cy={node.y} r={radius + 8} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" filter="url(#glow)" />
                          )}
                          <circle
                            cx={node.x} cy={node.y} r={radius}
                            fill={`${color}20`}
                            stroke={isSelected ? color : `${color}60`}
                            strokeWidth={isSelected ? 2 : 1.5}
                          />
                          <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14">
                            {NODE_ICONS[node.type] || '●'}
                          </text>
                          <text x={node.x} y={node.y + radius + 14} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">
                            {node.label.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 pt-3 border-t border-white/10 mt-2">
                {Object.entries(NODE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-xs text-slate-500 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Node Detail Panel */}
          <div>
            {selectedNode ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard className="p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: `${NODE_COLORS[selectedNode.type]}20`, border: `1px solid ${NODE_COLORS[selectedNode.type]}40` }}>
                      {NODE_ICONS[selectedNode.type]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{selectedNode.label}</h3>
                      <p className="text-xs capitalize font-semibold mt-0.5" style={{ color: NODE_COLORS[selectedNode.type] }}>
                        {selectedNode.type}
                      </p>
                    </div>
                  </div>

                  {selectedNode.industry && (
                    <div className="px-3 py-2 rounded-xl text-sm text-slate-400"
                      style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)' }}>
                      📦 {selectedNode.industry}
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Connections ({connectedEdges.length})</p>
                    <div className="space-y-2">
                      {connectedEdges.map((edge) => {
                        const otherId = edge.source === selected ? edge.target : edge.source;
                        const other = nodeMap[otherId];
                        return other ? (
                          <button key={edge.id} onClick={() => setSelected(otherId)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:opacity-80 transition-opacity"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <span className="text-lg">{NODE_ICONS[other.type]}</span>
                            <div className="min-w-0">
                              <p className="text-xs text-white font-medium truncate">{other.label}</p>
                              <p className="text-xs text-slate-600 capitalize">{edge.label} · {other.type}</p>
                            </div>
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <button onClick={() => setSelected(null)}
                    className="w-full text-xs text-slate-500 hover:text-white transition-colors py-2">
                    ✕ Clear selection
                  </button>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                <Network className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-slate-500 text-sm">Click any node to see its connections</p>
              </GlassCard>
            )}

            {/* Network stats */}
            <GlassCard className="p-5 mt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Network Stats</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Nodes</span>
                <span className="text-white font-bold">{graph.nodes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Connections</span>
                <span className="text-white font-bold">{graph.edges.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Density</span>
                <span className="text-[#D4AF37] font-bold">
                  {graph.nodes.length > 1 ? Math.round((graph.edges.length / (graph.nodes.length * (graph.nodes.length - 1) / 2)) * 100) : 0}%
                </span>
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
