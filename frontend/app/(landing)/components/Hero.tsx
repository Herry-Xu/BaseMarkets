"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

interface PriceTickerProps {
  price: number;
  change: number;
}

function PriceTicker({ price, change }: PriceTickerProps) {
  const changePercent = (change / (price - change)) * 100;
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass px-4 py-2 rounded-xl flex items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#F7931A] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">₿</span>
        </div>
        <span className="font-medium">BTC/USD</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono">${price.toLocaleString()}</span>
        <span className={`text-sm ${isPositive ? 'text-success' : 'text-warning'}`}>
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  );
}

function FloatingCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay,
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
      className="glass p-6 rounded-2xl relative overflow-hidden"
    >
      <div className="absolute top-3 right-3 px-2 py-1 bg-live-light text-live rounded-lg text-sm">
        LIVE
      </div>
      <div className="space-y-4">
        <div className="w-16 h-4 bg-primary/10 rounded" />
        <div className="space-y-2">
          <div className="w-32 h-6 bg-text-primary rounded" />
          <div className="w-24 h-4 bg-text-secondary/20 rounded" />
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const [price, setPrice] = useState(44231);
  const [change, setChange] = useState(1084);
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = price + (Math.random() - 0.5) * 100;
      const newChange = newPrice - 44231;
      setPrice(Math.round(newPrice));
      setChange(Math.round(newChange));
    }, 3000);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <div ref={targetRef} className="relative min-h-[85vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0"
        >
          {/* Price Movement Lines */}
          <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
            <pattern id="price-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path 
                d="M0 75 Q25 25 50 50 T100 25" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="text-primary"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#price-pattern)"/>
          </svg>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 grid grid-cols-3 gap-6 p-12 transform rotate-12 scale-110">
            {Array.from({ length: 6 }).map((_, i) => (
              <FloatingCard key={i} delay={i * 0.1} />
            ))}
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Price Ticker */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center mb-12"
          >
            <PriceTicker price={price} change={change} />
          </motion.div>

          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Where Crypto Gets Wild
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-text-secondary mb-8"
            >
              Next-gen crypto prediction platform
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="/app" 
                className="bg-gradient-primary text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity min-w-[200px]"
              >
                Launch App
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-text-secondary hover:text-primary transition-colors py-4 px-8"
              >
                Learn More →
              </Link>
            </motion.div>
          </div>

          {/* Preview Card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F7931A] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">₿</span>
                  </div>
                  <div>
                    <div className="font-bold">BTC/USD</div>
                    <div className="text-success text-sm">+2.45%</div>
                  </div>
                </div>
                <div className="text-xl font-mono font-bold">${price.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-success/10 text-success font-bold py-3 rounded-xl hover:bg-success/20 transition-colors">
                  UP (2.1x)
                </button>
                <button className="bg-warning/10 text-warning font-bold py-3 rounded-xl hover:bg-warning/20 transition-colors">
                  DOWN (1.9x)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 