'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard as Edit2, MapPin, Mail, Briefcase, Award } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/helpers';
import { dummyUser } from '@/utils/dummyData';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const profileData = user || dummyUser;

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 bg-zinc-900 border-zinc-800 mb-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-yellow-500">
                <AvatarFallback className="bg-yellow-500/20 text-yellow-500 text-3xl font-bold">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {profileData.name}
                    </h1>
                    <div className="flex flex-col gap-2 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profileData.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <p className="text-zinc-300 mb-4">{profileData.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {profileData.achievements.map((achievement) => {
              const Icon = Icons[achievement.icon] || Icons.Award;
              return (
                <motion.div
                  key={achievement.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Icon className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {achievement.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Experience</h2>
              </div>

              <div className="space-y-6">
                {profileData.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="pb-6 border-b border-zinc-800 last:border-0 last:pb-0"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-yellow-500 mb-2">{exp.company}</p>
                    <p className="text-sm text-zinc-400 mb-2">{exp.duration}</p>
                    <p className="text-zinc-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Goals</h2>
              </div>

              <div className="space-y-3">
                {profileData.goals.map((goal, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-black rounded-lg"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                    <span className="text-white">{goal}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
