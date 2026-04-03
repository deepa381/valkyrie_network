'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, TriangleAlert as AlertTriangle, Target, Users } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { dummyUser } from '@/utils/dummyData';

export default function FounderIntelligencePage() {
  const { founderDNA } = dummyUser;

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Founder Intelligence
          </h1>
          <p className="text-zinc-400">
            Understand your founder DNA and unlock your potential
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ProgressCircle value={founderDNA.overallScore} size={160} strokeWidth={10} />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Founder DNA Score
                </h2>
                <p className="text-lg text-zinc-300 mb-4">
                  You&apos;re in the top 1% of founders
                </p>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Excellent
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Trait Analysis</h2>
              </div>

              <div className="space-y-4">
                {founderDNA.traits.map((trait, index) => (
                  <motion.div
                    key={trait.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="text-white font-medium">{trait.name}</span>
                      <span className="text-yellow-500 font-bold">{trait.score}%</span>
                    </div>
                    <Progress value={trait.score} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Key Strengths</h2>
              </div>

              <div className="space-y-3">
                {founderDNA.strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-zinc-300">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Blind Spots</h2>
              </div>

              <div className="space-y-3">
                {founderDNA.blindSpots.map((blindSpot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-zinc-300">{blindSpot}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Leadership Profile</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Leadership Style</p>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {founderDNA.leadershipStyle}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-zinc-400 mb-2">Personality Type</p>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {founderDNA.personalityType}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-zinc-400 mb-2">Under Stress</p>
                  <p className="text-zinc-300">{founderDNA.stressBehavior}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">
                Ideal Co-founder Profile
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-zinc-400 mb-3">Complementary Traits</p>
                <div className="space-y-2">
                  {founderDNA.idealCofounder.traits.map((trait, index) => (
                    <Badge
                      key={index}
                      className="mr-2 mb-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-3">Required Skills</p>
                <div className="space-y-2">
                  {founderDNA.idealCofounder.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="mr-2 mb-2 bg-blue-500/10 text-blue-400 border-blue-500/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-3">Personality</p>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  {founderDNA.idealCofounder.personality}
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
