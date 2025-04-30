"use client";
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.min(end * progress, end));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {Math.round(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export function Stats() {
  const stats = [
    {
      value: 10,
      suffix: 'M+',
      prefix: '$',
      label: 'Total Volume',
      sublabel: 'in predictions made'
    },
    {
      value: 50000,
      suffix: '+',
      label: 'Predictions',
      sublabel: 'completed successfully'
    },
    {
      value: 99.9,
      suffix: '%',
      label: 'Uptime',
      sublabel: 'platform reliability'
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-card to-background border-y border-border-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Harwood by the numbers</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Join thousands of traders making predictions every day
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass p-8 rounded-2xl text-center"
            >
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-lg font-medium mb-1">{stat.label}</div>
              <div className="text-text-secondary">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>

        {/* Live Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">24h Volume</div>
                <div className="font-mono font-bold">$1.2M</div>
              </div>
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">Active Rounds</div>
                <div className="font-mono font-bold">24</div>
              </div>
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">Total Users</div>
                <div className="font-mono font-bold">12.5K</div>
              </div>
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">Win Rate</div>
                <div className="font-mono font-bold text-success">52.3%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 