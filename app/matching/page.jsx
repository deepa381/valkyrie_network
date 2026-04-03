'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { MatchCard } from '@/components/cards/match-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const matches = await matchService.getMatches();
        setMatches(matches);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    };
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

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Co-founder</h1>
          <p className="text-zinc-400">
            Discover founders with complementary skills and vision
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search by name, role, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-zinc-700 text-white hover:bg-zinc-900"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(filters.skills.length > 0 || filters.minScore > 0) && (
              <Badge className="ml-2 bg-yellow-500 text-black">
                {filters.skills.length + (filters.minScore > 0 ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {(filters.skills.length > 0 || filters.minScore > 0 || searchQuery) && (
            <Button
              variant="ghost"
              onClick={() => {
                resetFilters();
                setSearchQuery('');
              }}
              className="text-yellow-500 hover:text-yellow-400"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-6 bg-zinc-900 border border-zinc-800 rounded-lg"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Minimum Match Score
                </label>
                <Select
                  value={filters.minScore.toString()}
                  onValueChange={(value) => setFilters({ minScore: parseInt(value) })}
                >
                  <SelectTrigger className="bg-black border-zinc-800 text-white">
                    <SelectValue placeholder="Any score" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="0">Any score</SelectItem>
                    <SelectItem value="60">60% or higher</SelectItem>
                    <SelectItem value="75">75% or higher</SelectItem>
                    <SelectItem value="90">90% or higher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Skills (select multiple)
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {SKILLS.slice(0, 12).map((skill) => (
                    <Badge
                      key={skill}
                      onClick={() => toggleSkillFilter(skill)}
                      className={`cursor-pointer transition-all ${
                        filters.skills.includes(skill)
                          ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            <MatchCardSkeleton />
            <MatchCardSkeleton />
            <MatchCardSkeleton />
            <MatchCardSkeleton />
          </div>
        ) : filteredMatches.length === 0 ? (
          <EmptyState
            icon="Users"
            title="No matches found"
            description="Try adjusting your filters or search query to find more founders"
            actionLabel="Clear Filters"
            onAction={() => {
              resetFilters();
              setSearchQuery('');
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onConnect={handleConnect}
                onViewProfile={handleViewProfile}
              />
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
