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
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
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
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-zinc-400">Join the startup ecosystem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500"
            />
            {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
          </div>

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
            {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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
            {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">I am a</Label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROLES).map(([key, value]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.role === value
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
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
            {isLoading ? <Loader size="sm" /> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-yellow-500 hover:text-yellow-400 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
