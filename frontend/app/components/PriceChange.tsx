import { formatPrice } from '@/app/utils/format';
import { motion } from 'framer-motion';

interface PriceChangeProps {
  change: number;
  showArrow?: boolean;
  showPercentage?: boolean;
  basePrice?: number;
}

export function PriceChange({ change, showArrow = true, showPercentage = false, basePrice }: PriceChangeProps) {
  const isPositive = change >= 0;
  const colorClass = isPositive ? 'text-leaf' : 'text-berry';
  const formattedChange = formatPrice(Math.abs(change));
  const percentage = basePrice ? ((change / basePrice) * 100).toFixed(2) + '%' : null;

  return (
    <motion.div 
      className={`flex items-center gap-1 ${colorClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showArrow && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-5 h-5 ${isPositive ? '' : 'rotate-180'}`}
        >
          <path
            fillRule="evenodd"
            d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span className="font-mono">{formattedChange}</span>
      {showPercentage && percentage && (
        <span className="text-sm">({percentage})</span>
      )}
    </motion.div>
  );
} 