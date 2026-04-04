'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassInput } from '@/components/ui/glass-input';
import { GlassTextarea } from '@/components/ui/glass-textarea';
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
    <div className="min-h-screen flex items-center justify-center p-8 relative" style={{ background: '#0B0F19' }}>
      <div className="absolute inset-0 dot-grid opacity-30" style={{ backgroundSize: '28px 28px' }} />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="tag-gold text-xs">Founder Onboarding</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    index <= currentStep
                      ? 'border-[rgba(212,175,55,0.6)] bg-[rgba(212,175,55,0.2)] text-[#F5C542]'
                      : 'border-white/10 bg-white/5 text-slate-500'
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
                      index < currentStep ? 'bg-[#D4AF37]' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {steps[currentStep]}
          </h1>
          <p className="text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-8 border border-white/10"
          style={{ background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(16px)' }}
        >
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Tell us about yourself
                </label>
                <GlassTextarea
                  id="bio"
                  placeholder="I am a founder looking to build..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Location
                </label>
                <GlassInput
                  id="location"
                  type="text"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Select your skills (choose at least 1)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <Badge
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`cursor-pointer transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-[rgba(212,175,55,0.2)] text-[#F5C542] hover:bg-[rgba(212,175,55,0.3)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Industries of interest (choose at least 1)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((industry) => (
                    <Badge
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`cursor-pointer transition-all ${
                        formData.industries.includes(industry)
                          ? 'bg-[rgba(212,175,55,0.2)] text-[#F5C542] hover:bg-[rgba(212,175,55,0.3)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
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
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  What are your goals?
                </label>
                <div className="flex gap-2">
                  <GlassInput
                    type="text"
                    placeholder="e.g., Find a technical co-founder"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddGoal}
                    disabled={!goalInput.trim() || formData.goals.length >= 5}
                    className="btn-gold text-black font-semibold"
                  >
                    Add
                  </Button>
                </div>
                <p className="text-sm text-slate-500">
                  {formData.goals.length} / 5 goals added
                </p>
              </div>

              {formData.goals.length > 0 && (
                <div className="space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl"
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
            className="border-white/10 text-white hover:bg-white/5"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-gold text-black font-semibold"
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
