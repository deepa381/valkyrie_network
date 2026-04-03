'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { validateEmail } from '@/utils/helpers';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      login(response.user, response.token);
      router.push('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Zap className="w-7 h-7 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">Valkyrie Network</span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-zinc-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm text-zinc-400">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-yellow-500 hover:text-yellow-400"
              >
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{errors.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-11"
            >
              {isLoading ? <Loader size="sm" /> : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-yellow-500 hover:text-yellow-400 font-semibold">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-zinc-900 to-black items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Build the future
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Connect with co-founders, mentors, and investors in the startup ecosystem
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '10K+', label: 'Founders' },
              { value: '5K+', label: 'Matches' },
              { value: '2K+', label: 'Startups' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="p-6 bg-zinc-900/50 rounded-lg border border-zinc-800"
              >
                <p className="text-3xl font-bold text-yellow-500 mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
