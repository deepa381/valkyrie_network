'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { MatchCard } from '@/components/cards/match-card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MatchCardSkeleton } from '@/components/ui/skeleton-loader';
import { EmptyState } from '@/components/ui/empty-state';
import { useMatchStore } from '@/store/matchStore';
import { matchService } from '@/services/matchService';
import { SKILLS } from '@/utils/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }
  }),
};

export default function MatchingPage() {
  const {
    filteredMatches,
    filters,
    searchQuery,
    setMatches,
    setFilters,
    setSearchQuery,
    resetFilters,
  } = useMatchStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');
      const matches = await matchService.getMatches();
      setMatches(matches);
    } catch (error) {
      setError(error.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [setMatches]);

  const handleConnect = async (match) => {
    try {
      await matchService.connectWithMatch(match.id);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleViewProfile = (match) => {
    console.log('View profile:', match);
  };

  const toggleSkillFilter = (skill) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    setFilters({ skills: newSkills });
  };

  const activeFiltersCount = filters.skills.length + (filters.minScore > 0 ? 1 : 0);

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* ─── Page Header ─── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span className="tag-gold text-xs">AI-Powered</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                Find Your <span className="gradient-text">Co-founder</span>
              </h1>
              <p className="text-slate-400 text-sm">
                Discover founders with complementary skills and vision
              </p>
            </div>
            {filteredMatches.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <span className="text-[#D4AF37] font-bold text-lg">{filteredMatches.length}</span>
                <span className="text-slate-400 text-sm">matches found</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ─── Search + Filter Bar ─── */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by name, role, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 rounded-xl outline-none transition-all duration-300"
                style={{
                  background: searchFocused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                  border: searchFocused
                    ? '1px solid rgba(212,175,55,0.4)'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(212,175,55,0.07)' : 'none',
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: showFilters ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
                border: showFilters ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: showFilters ? '#F5C542' : '#94A3B8',
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-[#0B0F19]"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #F5C542)' }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear All */}
            {(activeFiltersCount > 0 || searchQuery) && (
              <button
                onClick={() => { resetFilters(); setSearchQuery(''); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* ─── Filter Panel ─── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl p-6"
                style={{
                  background: 'rgba(17,24,39,0.7)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                      Minimum Match Score
                    </label>
                    <Select
                      value={filters.minScore.toString()}
                      onValueChange={(value) => setFilters({ minScore: parseInt(value) })}
                    >
                      <SelectTrigger className="text-white rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <SelectValue placeholder="Any score" />
                      </SelectTrigger>
                      <SelectContent style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {[['0', 'Any score'], ['60', '60%+ match'], ['75', '75%+ match'], ['90', '90%+ match']].map(([v, l]) => (
                          <SelectItem key={v} value={v} className="text-slate-300 focus:text-white focus:bg-white/5">
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                      Filter by Skills
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                      {SKILLS.slice(0, 12).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkillFilter(skill)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                          style={filters.skills.includes(skill) ? {
                            background: 'rgba(212,175,55,0.15)',
                            border: '1px solid rgba(212,175,55,0.35)',
                            color: '#F5C542',
                          } : {
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#94A3B8',
                          }}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Match Cards Grid ─── */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {Array(4).fill(0).map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <EmptyState
            icon="TriangleAlert"
            title="Could not load matches"
            description={error}
            actionLabel="Retry"
            onAction={loadMatches}
          />
        ) : filteredMatches.length === 0 ? (
          <EmptyState
            icon="Users"
            title="No matches found"
            description="Try adjusting your filters or search query to find more founders"
            actionLabel="Clear Filters"
            onAction={() => { resetFilters(); setSearchQuery(''); }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-5"
          >
            {filteredMatches.map((match, i) => (
              <motion.div
                key={match.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <MatchCard
                  match={match}
                  onConnect={handleConnect}
                  onViewProfile={handleViewProfile}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
