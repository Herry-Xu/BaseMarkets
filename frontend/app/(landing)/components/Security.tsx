"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SecurityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: { label: string; value: string }[];
  delay?: number;
}

function SecurityCard({ title, description, icon, stats, delay = 0 }: SecurityCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass p-8 rounded-2xl"
    >
      <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-text-secondary mb-6">{description}</p>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card-hover rounded-xl p-4">
            <div className="text-sm text-text-secondary mb-1">{stat.label}</div>
            <div className="font-medium">{stat.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Security() {
  const securityFeatures = [
    {
      title: "Smart Contract Security",
      description: "Our smart contracts undergo rigorous auditing and continuous monitoring.",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      stats: [
        { label: "Audits Completed", value: "3" },
        { label: "Security Score", value: "A+" },
      ]
    },
    {
      title: "Insurance Coverage",
      description: "Comprehensive insurance protection for platform funds and user assets.",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      stats: [
        { label: "Coverage Amount", value: "$10M+" },
        { label: "Claims Success", value: "100%" },
      ]
    },
    {
      title: "Bug Bounty Program",
      description: "Active bug bounty program with rewards for identifying vulnerabilities.",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      stats: [
        { label: "Max Bounty", value: "$250K" },
        { label: "Total Paid", value: "$500K+" },
      ]
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Serious About Security</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Your funds are protected by multiple layers of security
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <SecurityCard
              key={index}
              {...feature}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Security Partners */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link 
            href="/docs/security" 
            className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            Learn more about our security measures
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 