'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { getInitials } from '@/utils/helpers';

export function MatchCard({ match, onConnect, onViewProfile, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={`p-6 bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 transition-all ${className}`}>
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-yellow-500">
            <AvatarFallback className="bg-yellow-500/20 text-yellow-500 text-lg font-bold">
              {getInitials(match.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{match.name}</h3>
                <p className="text-sm text-yellow-500 mb-2">{match.role}</p>
              </div>
              <ProgressCircle value={match.matchScore} size={80} strokeWidth={6} />
            </div>

            <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{match.bio}</p>

            <div className="flex items-center gap-2 mb-3 text-sm text-zinc-500">
              <MapPin className="w-4 h-4" />
              <span>{match.location}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {match.skills.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  {skill}
                </Badge>
              ))}
              {match.skills.length > 3 && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                  +{match.skills.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onConnect(match)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Connect
              </Button>
              <Button
                onClick={() => onViewProfile(match)}
                variant="outline"
                className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
