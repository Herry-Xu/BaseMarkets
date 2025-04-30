'use client';

type RoundStatus = 'Expired' | 'LIVE' | 'Next' | 'Later';

interface RoundStatusProps {
  status: RoundStatus;
  roundId: number;
}

export function RoundStatus({ status, roundId }: RoundStatusProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'LIVE':
        return 'text-moss';
      case 'Next':
        return 'text-sunlight';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-400">#{roundId}</span>
      <span className={`${getStatusStyles()}`}>
        {status}
      </span>
    </div>
  );
} 