"use client";

export function PredictMockup() {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="space-y-6">
        {/* Price Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F7931A] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">₿</span>
            </div>
            <div>
              <div className="font-bold">BTC/USD</div>
              <div className="text-success text-sm">+2.45%</div>
            </div>
          </div>
          <div className="text-xl font-mono font-bold">$44,231.00</div>
        </div>

        {/* Timer */}
        <div className="flex justify-center">
          <div className="px-4 py-2 bg-primary/10 rounded-lg">
            <span className="font-mono text-primary">4:32</span>
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-success/10 text-success font-bold py-4 rounded-xl">
            UP (2.1x)
          </button>
          <button className="bg-warning/10 text-warning font-bold py-4 rounded-xl">
            DOWN (1.9x)
          </button>
        </div>
      </div>
    </div>
  );
} 