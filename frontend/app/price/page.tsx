'use client';

import React, { useState } from 'react';
import AdvancedTradingViewChart from '../components/charts/AdvancedTradingViewChart';
import TimeframeSelector from '../components/charts/TimeframeSelector';

export default function PricePage() {
    const [selectedTimeframe, setSelectedTimeframe] = useState('5m');
    const [selectedSymbol, setSelectedSymbol] = useState('BNBUSD');

    const symbols = [
        { label: 'BNB/USD', value: 'BNBUSD' },
        { label: 'BTC/USD', value: 'BTCUSD' },
        { label: 'ETH/USD', value: 'ETHUSD' },
    ];

    const timeframes = [
        { label: '1m', value: '1m' },
        { label: '5m', value: '5m' },
        { label: '15m', value: '15m' },
        { label: '30m', value: '30m' },
        { label: '1h', value: '1h' },
        { label: '4h', value: '4h' },
        { label: '1D', value: '1D' },
    ];

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Price Charts</h1>

            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-text-secondary">Symbol:</span>
                        <select
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e.target.value)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                        >
                            {symbols.map((symbol) => (
                                <option key={symbol.value} value={symbol.value}>
                                    {symbol.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-text-secondary">Timeframe:</span>
                        <div className="flex border border-gray-200 rounded overflow-hidden">
                            {timeframes.map((tf) => (
                                <button
                                    key={tf.value}
                                    className={`px-3 py-1 text-sm ${selectedTimeframe === tf.value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white hover:bg-gray-100'
                                        }`}
                                    onClick={() => setSelectedTimeframe(tf.value)}
                                >
                                    {tf.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <AdvancedTradingViewChart
                    symbol={selectedSymbol}
                    timeframe={selectedTimeframe}
                    height={600}
                    className="mb-8"
                />
            </div>

            <div className="glass radius-2 p-4 mb-8">
                <h2 className="text-xl font-semibold mb-4">Market Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-text-secondary">Current Price</p>
                        <p className="text-2xl font-bold">$30,245.67</p>
                    </div>
                    <div>
                        <p className="text-text-secondary">24h Change</p>
                        <p className="text-2xl font-bold text-success">+2.34%</p>
                    </div>
                    <div>
                        <p className="text-text-secondary">24h Volume</p>
                        <p className="text-2xl font-bold">$1.2B</p>
                    </div>
                </div>
            </div>
        </main>
    );
}