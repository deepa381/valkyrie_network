'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Rocket, Users, CircleCheck as CheckCircle, Circle } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
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

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Startups</h1>
            <p className="text-zinc-400">Build and track your startup journey</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create Startup
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Create New Startup
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateStartup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Startup Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="My Awesome Startup"
                    className="bg-black border-zinc-800 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="What problem are you solving?"
                    rows={3}
                    className="bg-black border-zinc-800 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData({ ...formData, industry: value })
                    }
                  >
                    <SelectTrigger className="bg-black border-zinc-800 text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Current Stage</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) =>
                      setFormData({ ...formData, stage: value })
                    }
                  >
                    <SelectTrigger className="bg-black border-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {STARTUP_STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Create Startup
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : startups.length === 0 ? (
          <EmptyState
            icon="Rocket"
            title="No startups yet"
            description="Create your first startup and start building your dream"
            actionLabel="Create Startup"
            onAction={() => setIsDialogOpen(true)}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {startups.map((startup, index) => (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {startup.name}
                      </h3>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {startup.stage}
                      </Badge>
                    </div>
                    <Rocket className="w-8 h-8 text-yellow-500" />
                  </div>

                  <p className="text-zinc-400 mb-4">{startup.description}</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-white font-semibold">
                          {startup.progress}%
                        </span>
                      </div>
                      <Progress value={startup.progress} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm text-zinc-400">Team</span>
                      </div>
                      <div className="flex -space-x-2">
                        {startup.team.map((member, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full bg-yellow-500/20 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-yellow-500"
                          >
                            {member.name[0]}
                          </div>
                        ))}
                        <button className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <p className="text-sm text-zinc-400 mb-3">Milestones</p>
                    <div className="space-y-2">
                      {startup.milestones.slice(0, 3).map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          {milestone.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                          )}
                          <span
                            className={
                              milestone.completed ? 'text-zinc-400 line-through' : 'text-white'
                            }
                          >
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                      {startup.industry}
                    </Badge>
                    {startup.techStack?.slice(0, 2).map((tech, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-300"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
