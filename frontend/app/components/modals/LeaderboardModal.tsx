'use client';
import { Modal } from '../ui/Modal';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leaderboard">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.745 6.745 0 011.019-4.381z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">Coming Soon!</h3>
        <p className="text-text-secondary max-w-sm">
          The leaderboard is currently under development. Check back soon to compete with other traders!
        </p>
      </div>
    </Modal>
  );
}
