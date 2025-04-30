"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="min-h-[85vh] flex items-center">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
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
      </div>
      
      {/* Add other landing page sections */}
    </div>
  );
} 