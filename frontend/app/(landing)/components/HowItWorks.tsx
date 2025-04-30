"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectMockup } from './mockups/ConnectMockup';
import { PredictMockup } from './mockups/PredictMockup';
import { RewardsMockup } from './mockups/RewardsMockup';

interface StepProps {
  number: number;
  title: string;
  description: string;
  mockup: React.ReactNode;
  delay?: number;
}

function Step({ number, title, description, mockup, delay = 0 }: StepProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
    >
      {/* Number and Content */}
      <div className="flex-1 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl mb-6">
          {number}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-text-secondary text-lg leading-relaxed mb-6">
          {description}
        </p>
        {number === 1 && (
          <Link 
            href="/app" 
            className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>

      {/* Mockup */}
      <div className="flex-1">
        {mockup}
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Connect & Fund",
      description: "Sign in with email or connect your wallet. Fund your account with USDC to start making predictions.",
      mockup: <ConnectMockup />
    },
    {
      number: 2,
      title: "Choose Your Position",
      description: "Select UP or DOWN based on where you think the price will go in the next 5 minutes.",
      mockup: <PredictMockup />
    },
    {
      number: 3,
      title: "Collect Rewards",
      description: "If your prediction is correct, rewards are automatically sent to your account via smart contracts.",
      mockup: <RewardsMockup />
    }
  ];

  return (
    <div id="how-it-works" className="py-24 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Start predicting crypto price movements in three simple steps
          </p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <Step
              key={index}
              {...step}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5m</div>
                <div className="text-text-secondary">Round Duration</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">2x</div>
                <div className="text-text-secondary">Average Payout</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">3%</div>
                <div className="text-text-secondary">Platform Fee</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-text-secondary">Trading Hours</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 