'use client';

import React from 'react';

interface TimeframeSelectorProps {
    selectedTimeframe: string;
    onTimeframeChange: (timeframe: string) => void;
    timeframes?: Array<{ label: string; value: string }>;
    className?: string;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
    selectedTimeframe,
    onTimeframeChange,
    timeframes = [
        { label: '1m', value: '1m' },
        { label: '5m', value: '5m' },
        { label: '15m', value: '15m' },
        { label: '30m', value: '30m' },
        { label: '1h', value: '1h' },
        { label: '4h', value: '4h' },
        { label: '1D', value: '1D' },
    ],
    className = '',
}) => {
    return (
        <div className={`flex border border-gray-200 rounded overflow-hidden ${className}`}>
            {timeframes.map((timeframe) => (
                <button
                    key={timeframe.value}
                    className={`px-3 py-1 text-sm ${selectedTimeframe === timeframe.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                    onClick={() => onTimeframeChange(timeframe.value)}
                >
                    {timeframe.label}
                </button>
            ))}
        </div>
    );
};

export default TimeframeSelector;