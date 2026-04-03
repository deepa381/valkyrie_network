'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Users, Rocket, Brain, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'Founder Intelligence',
      description: 'Discover your founder DNA and get insights on your strengths and blind spots',
    },
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'Find the perfect co-founder based on compatibility scores and complementary skills',
    },
    {
      icon: Rocket,
      title: 'Startup Builder',
      description: 'Build and track your startup journey with milestone tracking and team management',
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Track your progress and get actionable insights to accelerate your startup',
    },
    {
      icon: Shield,
      title: 'Verified Network',
      description: 'Connect with verified founders, investors, and mentors in the ecosystem',
    },
    {
      icon: Zap,
      title: 'Fast Connections',
      description: 'Connect instantly with matched founders and start building together',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Founders' },
    { value: '5,000+', label: 'Successful Matches' },
    { value: '2,000+', label: 'Startups Built' },
    { value: '95%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Valkyrie Network</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Build the future
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                with the right team
              </span>
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Connect with co-founders, mentors, and investors. Get AI-powered insights
              on your founder DNA. Build your startup with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg h-14 px-8"
              >
                <Link href="/auth/signup">
                  Start Building
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-900 text-lg h-14 px-8"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />
            <div className="aspect-video bg-zinc-900 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                <p className="text-2xl font-bold text-white">Dashboard Preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-zinc-950">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                  {stat.value}
                </p>
                <p className="text-zinc-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              From finding co-founders to building your startup, we provide all the
              tools you need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 transition-all h-full">
                  <div className="p-3 bg-yellow-500/10 rounded-lg w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-yellow-500/10 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to build your startup?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of founders who are building the future
            </p>
            <Button
              asChild
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg h-14 px-8"
            >
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Valkyrie Network</span>
            </div>
            <p className="text-zinc-500">
              © 2024 Valkyrie Network. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
