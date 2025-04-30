"use client";
import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div 
        className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="mt-4 text-text-secondary">Loading...</p>
    </div>
  );
} 