"use client";
import { GameInterface } from '@/app/components/GameInterface';
import { usePriceFeed } from "@/app/services/priceFeed";
import { motion } from "framer-motion";

export default function AppPage() {
  usePriceFeed();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1200px] mx-auto"
      >
        <GameInterface />
      </motion.div>
    </div>
  );
} 