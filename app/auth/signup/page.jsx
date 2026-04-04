'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Crown, Users, Rocket } from 'lucide-react';
import { GlassInput } from '@/components/ui/glass-input';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { validateEmail, validatePassword } from '@/utils/helpers';
import { ROLES } from '@/utils/constants';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.FOUNDER,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authService.signup(formData);
      login(response.user, response.token);
      router.push('/auth/onboarding');
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0B0F19' }}>
      {/* Left: Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 dot-grid opacity-30" style={{ backgroundSize: '28px 28px' }} />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <div className="relative w-11 h-11 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5C542]" />
                <Zap className="w-6 h-6 text-[#0B0F19] relative z-10 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="text-base font-black text-white tracking-tight leading-none">VALKYRIE</div>
                <div className="text-[10px] text-[#D4AF37] tracking-widest font-medium mt-0.5">NETWORK</div>
              </div>
            </Link>
            <h1 className="text-3xl font-black text-white mb-2 leading-tight">Create your account</h1>
            <p className="text-slate-400 text-sm">Join the global women founder ecosystem</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Full Name
              </label>
              <GlassInput
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Email Address
              </label>
              <GlassInput
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Password
              </label>
              <div className="relative">
                <GlassInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Confirm Password
              </label>
              <GlassInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(ROLES).map(([key, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: value })}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      formData.role === value
                        ? 'border border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.15)] text-[#F5C542]'
                        : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {errors.submit && (
              <div
                className="p-3.5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <p className="text-xs text-red-400">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#0B0F19]/30 border-t-[#0B0F19] animate-spin" />
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#D4AF37] hover:text-[#F5C542] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Brand Panel */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D1117 0%, #111827 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 30% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)' }}
        />
        <div className="absolute inset-0 dot-grid opacity-20" style={{ backgroundSize: '28px 28px' }} />

        <div className="relative z-10 flex flex-col items-center justify-center p-16 text-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.2)',
                boxShadow: '0 0 40px rgba(212,175,55,0.1)',
              }}
            >
              <Crown
                className="w-10 h-10 text-[#D4AF37]"
                style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))' }}
              />
            </div>

            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Build with <span className="gradient-text">Confidence</span>
            </h2>
            <p className="text-slate-400 text-base mb-10 max-w-sm mx-auto leading-relaxed">
              Join founders, mentors, and investors aligned to your vision and growth.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '5.2K+', label: 'Founders', icon: Users },
                { value: '1.2K+', label: 'Startups', icon: Rocket },
                { value: '450+', label: 'Investors', icon: Crown },
              ].map(({ value, label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <div
                    className="p-4 rounded-2xl text-center"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Icon className="w-4 h-4 text-[#D4AF37] mx-auto mb-2" />
                    <p className="text-2xl font-black text-white mb-0.5">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
