"use client";

export function RewardsMockup() {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Reward Amount */}
        <div className="text-center">
          <div className="text-sm text-text-secondary mb-1">You won!</div>
          <div className="text-2xl font-bold text-success">+$124.50</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card-hover rounded-xl p-4 text-center">
            <div className="text-sm text-text-secondary mb-1">Prediction</div>
            <div className="font-medium text-success">UP</div>
          </div>
          <div className="bg-card-hover rounded-xl p-4 text-center">
            <div className="text-sm text-text-secondary mb-1">Multiplier</div>
            <div className="font-medium">2.1x</div>
          </div>
        </div>
      </div>
    </div>
  );
} 