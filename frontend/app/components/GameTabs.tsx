"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Round } from '@/app/types/game';
import { ActivePredictions } from './ActivePredictions';
import { PriceChart } from './PriceChart';
import { formatUSDC } from '@/app/utils/format';

interface GameTabsProps {
  round: Round;
  currentPrice: number;
}

const tabs = [
  {
    id: 'active',
    label: 'Active Predictions',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    id: 'chart',
    label: 'Price Chart',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    )
  },
  {
    id: 'market',
    label: 'Market Info',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export function GameTabs({ round, currentPrice }: GameTabsProps) {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-card-hover rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md font-medium relative
              ${activeTab === tab.id ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon}
              {tab.label}
            </div>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'active' && <ActivePredictions />}
          {activeTab === 'chart' && <PriceChart round={round} currentPrice={currentPrice} />}
          {activeTab === 'market' && (
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-medium mb-4">Market Information</h3>
              <div className="space-y-4">
                <div className="bg-card-hover p-4 rounded-xl">
                  <div className="text-text-secondary mb-1">24h Volume</div>
                  <div className="font-mono text-lg">{formatUSDC(1200000)}</div>
                </div>
                <div className="bg-card-hover p-4 rounded-xl">
                  <div className="text-text-secondary mb-1">Total Predictions</div>
                  <div className="font-mono text-lg">24,521</div>
                </div>
                <div className="bg-card-hover p-4 rounded-xl">
                  <div className="text-text-secondary mb-1">Average Win Rate</div>
                  <div className="font-mono text-lg text-success">52.3%</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 