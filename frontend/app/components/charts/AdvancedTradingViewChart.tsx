'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, UTCTimestamp } from 'lightweight-charts';

interface ChartProps {
    symbol?: string;
    timeframe?: string;
    height?: number;
    className?: string;
}

export default function AdvancedTradingViewChart({
    symbol = 'BNBUSD',
    timeframe = '5m',
    height = 500,
    className = '',
}: ChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number>(0);
    const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        setIsLoading(true);

        // Clean up previous chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: 'solid', color: '#ffffff' },
                textColor: '#333',
                fontFamily: 'Inter, system-ui, sans-serif',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.1)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.1)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            timeScale: {
                timeVisible: true,
                secondsVisible: timeframe === '1m',
                borderColor: 'rgba(42, 46, 57, 0.2)',
            },
            rightPriceScale: {
                borderColor: 'rgba(42, 46, 57, 0.2)',
            },
            crosshair: {
                mode: 0, // Normal crosshair
            },
        });

        chartRef.current = chart;

        // Add candlestick series
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        // Add volume series
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // Create a separate scale
            scaleMargins: {
                top: 0.8, // Position at the bottom 20% of the chart
                bottom: 0,
            },
        });

        // Generate or fetch data
        const fetchData = async () => {
            try {
                // In a real app, replace with your API call
                // const response = await fetch(`/api/price/history?symbol=${symbol}&interval=${timeframe}`);
                // const data = await response.json();

                // For demo, generate sample data
                const data = generateSampleData(timeframe, symbol);

                // Set current price and price change
                if (data.length > 0) {
                    const lastCandle = data[data.length - 1];
                    const firstCandle = data[0];
                    setCurrentPrice(lastCandle.close);
                    const change = lastCandle.close - firstCandle.open;
                    setPriceChange(change);
                    setPriceChangePercent((change / firstCandle.open) * 100);
                }

                // Format data for candlestick series
                const candleData = data.map(item => ({
                    time: item.time as UTCTimestamp,
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                }));

                // Format data for volume series
                const volumeData = data.map(item => ({
                    time: item.time as UTCTimestamp,
                    value: item.volume,
                    color: item.close >= item.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
                }));

                candlestickSeries.setData(candleData);
                volumeSeries.setData(volumeData);

                // Add price line for current price
                candlestickSeries.createPriceLine({
                    price: candleData[candleData.length - 1].close,
                    color: '#2962FF',
                    lineWidth: 1,
                    lineStyle: 2, // Dashed
                    axisLabelVisible: true,
                    title: 'Current Price',
                });

                chart.timeScale().fitContent();
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch chart data:', error);
                setIsLoading(false);
            }
        };

        fetchData();

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [symbol, timeframe, height]);

    return (
        <div className={`bg-white rounded-lg shadow-sm ${className}`}>
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{symbol}</h2>
                        {currentPrice && (
                            <span className="text-lg font-medium">
                                {currentPrice.toFixed(2)}
                            </span>
                        )}
                        {priceChange !== 0 && (
                            <span className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div ref={chartContainerRef} />
            )}
        </div>
    );
}

// Helper function to generate sample data
function generateSampleData(timeframe: string, symbol: string) {
    const data = [];
    const now = new Date();
    const secondsInBar = timeframeToSeconds(timeframe);
    const barsCount = 100;

    // Set base price based on symbol
    let basePrice = 600; // Default for BNBUSD
    if (symbol === 'BTCUSD') basePrice = 30000;
    if (symbol === 'ETHUSD') basePrice = 1800;

    let lastClose = basePrice;
    let lastVolume = 1000;

    for (let i = 0; i < barsCount; i++) {
        const time = Math.floor(now.getTime() / 1000) - (barsCount - i) * secondsInBar;

        // Generate realistic-looking price movements
        const volatility = 0.01;
        const changePercent = (Math.random() * 2 - 1) * volatility;
        const open = lastClose;
        const close = open * (1 + changePercent);
        const high = Math.max(open, close) * (1 + Math.random() * 0.005);
        const low = Math.min(open, close) * (1 - Math.random() * 0.005);
        const volume = lastVolume * (0.9 + Math.random() * 0.2);

        data.push({
            time,
            open,
            high,
            low,
            close,
            volume,
        });

        lastClose = close;
        lastVolume = volume;
    }

    return data;
}

function timeframeToSeconds(timeframe: string) {
    switch (timeframe) {
        case '1m': return 60;
        case '5m': return 5 * 60;
        case '15m': return 15 * 60;
        case '30m': return 30 * 60;
        case '1h': return 60 * 60;
        case '4h': return 4 * 60 * 60;
        case '1D': return 24 * 60 * 60;
        default: return 5 * 60; // Default to 5m
    }
}