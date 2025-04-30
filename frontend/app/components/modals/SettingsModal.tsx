"use client";
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useGameState } from '@/app/hooks/useGameState';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { notifications, sounds, chartType, setNotifications, setSounds, setChartType } = useGameState();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="glass w-full max-w-md rounded-2xl">
          <div className="p-6">
            <Dialog.Title className="text-xl font-bold mb-6">
              Settings
            </Dialog.Title>

            <div className="space-y-6">
              {/* Chart Type */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Chart Type</h3>
                  <p className="text-text-secondary text-sm">Choose your preferred chart style</p>
                </div>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as 'line' | 'candle')}
                  className="bg-card-hover rounded-lg px-3 py-2 text-sm"
                >
                  <option value="line">Line Chart</option>
                  <option value="candle">Candlestick</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-text-secondary text-sm">Get alerts for round results</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-primary' : 'bg-card-hover'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sound Effects</h3>
                  <p className="text-text-secondary text-sm">Play sounds on actions</p>
                </div>
                <button
                  onClick={() => setSounds(!sounds)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    sounds ? 'bg-primary' : 'bg-card-hover'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    sounds ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}