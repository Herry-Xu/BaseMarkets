'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface TradingViewChartProps {
    symbol: string;
    timeframe: string;
    height?: number;
    width?: string;
    className?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
    symbol = 'BTCUSD',
    timeframe = '1D',
    height = 400,
    width = '100%',
    className = '',
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        // Clean up previous chart if it exists
        if (chartRef.current) {
            chartRef.current.remove();
        }

        if (!chartContainerRef.current) return;

        // Create new chart
        const newChart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'var(--text-secondary)',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.1)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.1)' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: 'rgba(42, 46, 57, 0.2)',
            },
            rightPriceScale: {
                borderColor: 'rgba(42, 46, 57, 0.2)',
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
        });

        chartRef.current = newChart;

        // Create candlestick series
        const candlestickSeries = newChart.addCandlestickSeries({
            upColor: 'var(--success)',
            downColor: 'var(--warning)',
            borderVisible: false,
            wickUpColor: 'var(--success)',
            wickDownColor: 'var(--warning)',
        });

        // Fetch data based on symbol and timeframe
        const fetchData = async () => {
            try {
                // Determine the API endpoint based on timeframe
                let interval;
                switch (timeframe) {
                    case '1m': interval = '1m'; break;
                    case '5m': interval = '5m'; break;
                    case '15m': interval = '15m'; break;
                    case '1h': interval = '1h'; break;
                    case '4h': interval = '4h'; break;
                    case '1D': default: interval = '1d'; break;
                    case '1W': interval = '1w'; break;
                }

                // Replace with your actual API endpoint
                const response = await fetch(`/api/price/history?symbol=${symbol}&interval=${interval}`);
                const data = await response.json();

                // Format data for the chart
                const formattedData = data.map((item: any) => ({
                    time: item.time,
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                }));

                candlestickSeries.setData(formattedData);

                // Fit content to view
                newChart.timeScale().fitContent();
            } catch (error) {
                console.error('Failed to fetch chart data:', error);

                // Use sample data for development/fallback
                const sampleData = generateSampleData(timeframe);
                candlestickSeries.setData(sampleData);
                newChart.timeScale().fitContent();
            }
        };

        fetchData();

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                });
            }
        };

        // Set up resize observer
        resizeObserverRef.current = new ResizeObserver(handleResize);
        if (chartContainerRef.current) {
            resizeObserverRef.current.observe(chartContainerRef.current);
        }

        // Clean up
        return () => {
            if (resizeObserverRef.current && chartContainerRef.current) {
                resizeObserverRef.current.unobserve(chartContainerRef.current);
            }
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [symbol, timeframe, height]);

    return (
        <div className={`glass radius-2 p-4 ${className}`}>
            <div className="mb-2 text-lg font-medium">{symbol} Chart</div>
            <div ref={chartContainerRef} style={{ height: `${height}px`, width }} />
        </div>
    );
};

// Generate sample data for development/fallback
function generateSampleData(timeframe: string) {
    const data = [];
    const now = new Date();
    const secondsInBar = timeframeToSeconds(timeframe);
    const barsCount = 100;

    let basePrice = 30000; // Starting BTC price
    let lastClose = basePrice;

    for (let i = 0; i < barsCount; i++) {
        const time = Math.floor(now.getTime() / 1000) - (barsCount - i) * secondsInBar;

        // Generate realistic-looking price movements
        const volatility = 0.02;
        const changePercent = (Math.random() * 2 - 1) * volatility;
        const open = lastClose;
        const close = open * (1 + changePercent);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);

        data.push({
            time,
            open,
            high,
            low,
            close,
        });

        lastClose = close;
    }

    return data;
}

function timeframeToSeconds(timeframe: string) {
    switch (timeframe) {
        case '1m': return 60;
        case '5m': return 5 * 60;
        case '15m': return 15 * 60;
        case '1h': return 60 * 60;
        case '4h': return 4 * 60 * 60;
        case '1D': return 24 * 60 * 60;
        case '1W': return 7 * 24 * 60 * 60;
        default: return 24 * 60 * 60; // Default to 1 day
    }
}

export default TradingViewChart;