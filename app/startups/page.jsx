'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Rocket, Users, CheckCircle, Circle, Calendar, Tag, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { useStartupStore } from '@/store/startupStore';
import { startupService } from '@/services/startupService';
import { INDUSTRIES, STARTUP_STAGES } from '@/utils/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }
  }),
};

const stageConfig = {
  Idea: { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.25)' },
  MVP: { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)' },
  Launched: { color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)' },
  Growing: { color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
  Scaling: { color: '#FB7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.25)' },
};

export default function StartupsPage() {
  const { startups, setStartups, addStartup } = useStartupStore();
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    stage: 'Idea',
  });

  useEffect(() => {
    const loadStartups = async () => {
      try {
        setLoading(true);
        const data = await startupService.getStartups();
        setStartups(data);
      } catch (error) {
        console.error('Failed to load startups:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStartups();
  }, [setStartups]);

  const handleCreateStartup = async (e) => {
    e.preventDefault();
    try {
      const newStartup = await startupService.createStartup(formData);
      addStartup(newStartup);
      setIsDialogOpen(false);
      setFormData({ name: '', description: '', industry: '', stage: 'Idea' });
    } catch (error) {
      console.error('Failed to create startup:', error);
    }
  };

  const GlassInput = ({ id, value, onChange, placeholder, required = false }) => (
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 text-sm text-white placeholder:text-slate-600 rounded-xl outline-none transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(212,175,55,0.4)';
        e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.07)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* ─── Page Header ─── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-[#D4AF37]" />
                <span className="tag-gold text-xs">Your Journey</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                Your <span className="gradient-text">Startups</span>
              </h1>
              <p className="text-slate-400 text-sm">Build and track your startup journey</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold">
                  <Plus className="w-4 h-4" />
                  Create Startup
                </button>
              </DialogTrigger>

              <DialogContent
                className="border-[rgba(255,255,255,0.08)] text-white max-w-md"
                style={{ background: '#111827' }}
              >
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-[#D4AF37]" />
                    Create New Startup
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateStartup} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Startup Name
                    </label>
                    <GlassInput
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Awesome Startup"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What problem are you solving?"
                      rows={3}
                      required
                      className="w-full px-4 py-3 text-sm text-white placeholder:text-slate-600 rounded-xl outline-none transition-all duration-200 resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(212,175,55,0.4)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.07)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Industry</label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData({ ...formData, industry: value })}
                      >
                        <SelectTrigger className="text-sm text-white rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {INDUSTRIES.map((i) => (
                            <SelectItem key={i} value={i} className="text-slate-300 focus:text-white focus:bg-white/5">{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Stage</label>
                      <Select
                        value={formData.stage}
                        onValueChange={(value) => setFormData({ ...formData, stage: value })}
                      >
                        <SelectTrigger className="text-sm text-white rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {STARTUP_STAGES.map((s) => (
                            <SelectItem key={s} value={s} className="text-slate-300 focus:text-white focus:bg-white/5">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full btn-gold py-3 rounded-xl text-sm font-bold mt-2">
                    Launch My Startup ✦
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* ─── Content ─── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-[rgba(212,175,55,0.15)]" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#D4AF37] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
          </div>
        ) : startups.length === 0 ? (
          <EmptyState
            icon="Rocket"
            title="No startups yet"
            description="Create your first startup and start building your dream. The journey of a thousand miles begins with a single step."
            actionLabel="Create Startup"
            onAction={() => setIsDialogOpen(true)}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {startups.map((startup, index) => {
              const sc = stageConfig[startup.stage] || stageConfig.Idea;
              return (
                <motion.div
                  key={startup.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative rounded-2xl p-6 h-full flex flex-col overflow-hidden transition-all duration-300 group"
                    style={{
                      background: 'rgba(17,24,39,0.7)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
                      e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                    }}
                  >
                    {/* Background corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'radial-gradient(circle at top right, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <div>
                        <h3 className="text-xl font-black text-white mb-2">{startup.name}</h3>
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {startup.stage}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <Rocket className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 mb-5 leading-relaxed relative z-10">{startup.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-5 relative z-10">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500 font-medium">Progress</span>
                        <span className="font-bold text-white">{startup.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${startup.progress}%`,
                            background: 'linear-gradient(90deg, #D4AF37, #F5C542)',
                            boxShadow: '0 0 8px rgba(212,175,55,0.4)',
                          }} />
                      </div>
                    </div>

                    {/* Team Avatars */}
                    <div className="flex items-center gap-3 mb-5 relative z-10">
                      <div className="flex -space-x-2">
                        {startup.team.map((member, idx) => (
                          <div key={idx}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
                            style={{
                              background: 'rgba(212,175,55,0.15)',
                              color: '#F5C542',
                              borderColor: '#0B0F19',
                            }}>
                            {member.name[0]}
                          </div>
                        ))}
                        <button className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)', borderColor: '#0B0F19', color: '#64748b' }}>
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-slate-500">{startup.team.length} team members</span>
                    </div>

                    {/* Milestones */}
                    <div className="border-t border-[rgba(255,255,255,0.05)] pt-4 relative z-10">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">Milestones</p>
                      <div className="space-y-2">
                        {startup.milestones.slice(0, 3).map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-2.5">
                            {milestone.completed
                              ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              : <Circle className="w-4 h-4 text-slate-700 flex-shrink-0" />}
                            <span className={`text-xs ${milestone.completed ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4 relative z-10">
                      <span className="tag-glass">{startup.industry}</span>
                      {startup.techStack?.slice(0, 2).map((tech, idx) => (
                        <span key={idx} className="tag-glass">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
