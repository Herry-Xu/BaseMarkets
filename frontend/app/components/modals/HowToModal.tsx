"use client";
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToModal({ isOpen, onClose }: HowToModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="glass w-full max-w-md rounded-2xl">
          <div className="p-6">
            <Dialog.Title className="text-xl font-bold mb-6">
              How to Play
            </Dialog.Title>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Predict the Price</h3>
                  <p className="text-text-secondary text-sm">
                    Choose whether BTC will go UP or DOWN in the next round. Each round lasts 5 minutes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">Place Your Bet</h3>
                  <p className="text-text-secondary text-sm">
                    Enter the amount you want to bet. The larger the price movement, the higher your potential payout.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">Wait for Results</h3>
                  <p className="text-text-secondary text-sm">
                    At the end of the round, if your prediction is correct, you&apos;ll win! Payouts are automatically calculated based on the price movement.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
