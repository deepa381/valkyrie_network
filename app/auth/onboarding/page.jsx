'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SKILLS, INDUSTRIES } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';

const steps = ['Profile', 'Skills', 'Goals'];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    skills: [],
    industries: [],
    goals: [],
  });

  const [goalInput, setGoalInput] = useState('');

  const handleAddGoal = () => {
    if (goalInput.trim() && formData.goals.length < 5) {
      setFormData({ ...formData, goals: [...formData.goals, goalInput.trim()] });
      setGoalInput('');
    }
  };

  const handleRemoveGoal = (index) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index),
    });
  };

  const toggleSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter((s) => s !== skill)
        : [...formData.skills, skill],
    });
  };

  const toggleIndustry = (industry) => {
    setFormData({
      ...formData,
      industries: formData.industries.includes(industry)
        ? formData.industries.filter((i) => i !== industry)
        : [...formData.industries, industry],
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      updateUser(formData);
      router.push('/dashboard');
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return formData.bio && formData.location;
    if (currentStep === 1) return formData.skills.length > 0 && formData.industries.length > 0;
    if (currentStep === 2) return formData.goals.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    index <= currentStep
                      ? 'border-yellow-500 bg-yellow-500 text-black'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      index < currentStep ? 'bg-yellow-500' : 'bg-zinc-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {steps[currentStep]}
          </h1>
          <p className="text-zinc-400">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-8"
        >
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Tell us about yourself
                </Label>
                <Textarea
                  id="bio"
                  placeholder="I'm a passionate entrepreneur looking to..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="bg-black border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-black border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-white">Select your skills (choose at least 1)</Label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <Badge
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`cursor-pointer transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white">
                  Industries of interest (choose at least 1)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((industry) => (
                    <Badge
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`cursor-pointer transition-all ${
                        formData.industries.includes(industry)
                          ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-white">What are your goals?</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., Find a technical co-founder"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    className="bg-black border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500"
                  />
                  <Button
                    type="button"
                    onClick={handleAddGoal}
                    disabled={!goalInput.trim() || formData.goals.length >= 5}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Add
                  </Button>
                </div>
                <p className="text-sm text-zinc-500">
                  {formData.goals.length} / 5 goals added
                </p>
              </div>

              {formData.goals.length > 0 && (
                <div className="space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-lg"
                    >
                      <span className="text-white">{goal}</span>
                      <button
                        onClick={() => handleRemoveGoal(index)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-zinc-700 text-white hover:bg-zinc-900"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            {currentStep === steps.length - 1 ? (
              'Complete'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
