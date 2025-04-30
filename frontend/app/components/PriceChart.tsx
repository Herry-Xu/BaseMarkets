"use client";
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, UTCTimestamp, LineWidth } from 'lightweight-charts';
import { motion } from 'framer-motion';
import { Round } from '@/app/types/game';
import { useGameState } from '@/app/hooks/useGameState';
import type { PricePoint } from '@/app/hooks/useGameState';

interface PriceChartProps {
  round: Round;
  currentPrice: number;
}

export function PriceChart({ round, currentPrice }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const chartType = useGameState((state) => state.chartType);
  const priceHistory = useGameState((state) => state.priceHistory);
  const isUp = currentPrice >= round.startPrice;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Calculate price range based on 50-point intervals
    const priceStep = 50;
    const numSteps = 1;
    const basePrice = round.startPrice;
    const minPrice = Math.floor(basePrice / priceStep) * priceStep - (priceStep * numSteps);
    const maxPrice = Math.ceil(basePrice / priceStep) * priceStep + (priceStep * numSteps);

    const containerWidth = chartContainerRef.current.clientWidth;
    const barSpacing = (containerWidth - 60) / 60; // Calculate spacing to fit 60 seconds

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(51, 65, 85, 0.8)',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: {
          visible: true,
          style: 1,
          color: 'rgba(42, 46, 57, 0.1)',
        },
        horzLines: {
          visible: true,
          style: 1,
          color: 'rgba(42, 46, 57, 0.1)',
        },
      },
      width: containerWidth,
      height: 320,
      rightPriceScale: {
        borderVisible: false,
        autoScale: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        ticksVisible: true,
        mode: 0,
        alignLabels: true,
        entireTextOnly: true,
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: true,
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        barSpacing: barSpacing,
        minBarSpacing: barSpacing,
        rightOffset: 0,
        uniformDistribution: true,
        lockVisibleTimeRangeOnResize: true,
        tickMarkFormatter: (time: number) => {
          if (time % 10 === 0 && time <= 60) {
            return time.toString().padStart(2, '0');
          }
          return '';
        },
      },
    });

    // Set fixed visible range
    chart.timeScale().setVisibleLogicalRange({
      from: 0,
      to: 60,
    });

    const series = chart.addLineSeries({
      color: isUp ? '#15BE77' : '#FF453A',
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
      autoscaleInfoProvider: () => {
        // Calculate price range to ensure 50-point intervals
        const midPrice = round.startPrice;
        const totalRange = priceStep * numSteps * 2; // Total range we want to show
        const minValue = Math.floor(midPrice / priceStep) * priceStep - (totalRange / 2);
        const maxValue = Math.ceil(midPrice / priceStep) * priceStep + (totalRange / 2);
        
        return {
          priceRange: {
            minValue,
            maxValue,
          },
        };
      },
    });

    // Add start price line
    series.createPriceLine({
      price: round.startPrice,
      color: 'rgba(51, 65, 85, 0.3)',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Start Price',
    });

    // Initialize with more interpolated points for smoother line
    const points = [];
    const elapsedSeconds = Math.floor((Date.now() - round.startTime) / 1000);
    
    // Add initial point
    points.push({
      time: 0 as UTCTimestamp,
      value: round.startPrice,
    });

    // Add interpolated points up to current time
    if (elapsedSeconds > 0) {
      const priceDiff = currentPrice - round.startPrice;
      for (let i = 1; i <= elapsedSeconds; i++) {
        // Use a simple easing function for smoother interpolation
        const progress = i / 60;
        const easedProgress = progress * (2 - progress); // Quadratic easing
        const interpolatedPrice = round.startPrice + (priceDiff * easedProgress * (i / elapsedSeconds));
        
        points.push({
          time: i as UTCTimestamp,
          value: interpolatedPrice,
        });
      }
    }

    series.setData(points);

    // Real-time updates
    const updateChart = () => {
      const currentElapsed = Math.floor((Date.now() - round.startTime) / 1000);
      if (currentElapsed >= 0 && currentElapsed <= 60) {
        // Update the last point or add a new one
        series.update({
          time: currentElapsed as UTCTimestamp,
          value: currentPrice
        });
      }
    };

    const interval = setInterval(updateChart, 50);
    updateChart();

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [round.startTime, round.startPrice, currentPrice, isUp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Price Chart</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isUp ? 'bg-success' : 'bg-warning'}`} />
            <span className="text-sm text-text-secondary">Live Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-text-secondary opacity-30" />
            <span className="text-sm text-text-secondary">Start Price</span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} />
    </motion.div>
  );
} 