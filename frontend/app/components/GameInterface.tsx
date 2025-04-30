"use client";
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGameState } from '@/app/hooks/useGameState';
import { useAuthModal, useSignerStatus } from "@account-kit/react";
import { formatUSDC } from '@/app/utils/format';
import { Round, PredictionDirection } from '@/app/types/game';
import { toast } from 'sonner';
import { getTimeRemaining } from '@/app/utils/time';
import { markets } from '@/app/types/game';
import { PredictionModal } from '@/app/components/modals/PredictionModal';
import { MarketSelector } from './MarketSelector';
import { LiveRound } from './LiveRound';
import { PriceChart } from './PriceChart';
import { NextRoundEntry } from './NextRoundEntry';
import { GameTabs } from './GameTabs';
import { PriceTicker } from './PriceTicker';
import { LoadingState } from './ui/LoadingState';
import { ErrorBoundary } from './ErrorBoundary';
import { TopBar } from './TopBar';
import { HistoryModal } from './modals/HistoryModal';
import { LeaderboardModal } from './modals/LeaderboardModal';
import { HowToModal } from './modals/HowToModal';
import { SettingsModal } from './modals/SettingsModal';
import { PreviousRounds } from './PreviousRounds';
import { PriceChange } from './PriceChange';
import { formatPrice } from '@/app/utils/format';
import { useRoundTimer } from '@/app/hooks/useRoundTimer';
import { useRoundRotation } from '@/app/hooks/useRoundRotation';
import { useTimer } from '@/app/hooks/useTimer';

export function GameInterface() {
  // Auth state
  const { isConnected } = useSignerStatus();
  const { openAuthModal } = useAuthModal();

  // Local state
  const [modalOpen, setModalOpen] = useState(false);
  const [predictionDirection, setPredictionDirection] = useState<PredictionDirection>('up');
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Game state
  const gameState = useGameState();
  const { currentPrice, rounds, placePrediction, isLoading, error } = gameState;

  // Memoized values
  const nextRoundPayout = useMemo(() => {
    return rounds.next[predictionDirection === 'up' ? 'upPayout' : 'downPayout'];
  }, [rounds.next, predictionDirection]);

  const priceChange = useMemo(() => {
    return currentPrice - rounds.live.startPrice;
  }, [currentPrice, rounds.live.startPrice]);

  // Use the timer hook for both rounds
  const liveTimeRemaining = useTimer(rounds.live.endTime);
  const nextTimeRemaining = useTimer(rounds.live.endTime);

  // Handle round rotation
  useEffect(() => {
    if (liveTimeRemaining <= 0) {
      // Add small delay to ensure clean transition
      const timeout = setTimeout(() => {
        gameState.rotateRounds();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [liveTimeRemaining, gameState]);

  // Event handlers
  const handlePredictionClick = useCallback((direction: PredictionDirection) => {
    if (!isConnected) {
      openAuthModal();
      return;
    }
    setPredictionDirection(direction);
    setModalOpen(true);
  }, [isConnected, openAuthModal]);

  const handlePredictionConfirm = useCallback((amount: number) => {
    placePrediction(rounds.next.id, predictionDirection, amount);
    setModalOpen(false);
    toast(`${formatUSDC(amount)} USDC placed on ${predictionDirection.toUpperCase()} position`);
  }, [rounds.next.id, predictionDirection, placePrediction]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorBoundary>{error}</ErrorBoundary>;

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <TopBar
        currentPrice={currentPrice}
        priceChange={priceChange}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Live & Next Rounds */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          {/* Mobile Price Display */}
          <div className="block lg:hidden glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Current Price</span>
              <PriceChange
                change={priceChange}
                basePrice={rounds.live.startPrice}
                showPercentage
              />
            </div>
            <div className={`text-2xl font-mono font-bold ${priceChange >= 0 ? 'text-success' : 'text-warning'}`}>
              ${formatPrice(currentPrice)}
            </div>
          </div>

          {/* Live Round */}
          <div className="glass rounded-2xl flex-1">
            <LiveRound
              round={rounds.live}
              currentPrice={currentPrice}
              timeRemaining={liveTimeRemaining}
            />
          </div>

          {/* Next Round */}
          <div className="glass rounded-2xl flex-1">
            <NextRoundEntry
              round={rounds.next}
              currentPrice={currentPrice}
              onPredictionClick={handlePredictionClick}
              timeRemaining={liveTimeRemaining}
            />
          </div>
        </div>

        {/* Right Column - Chart & Previous Rounds */}
        <div className="hidden lg:col-span-7 lg:flex lg:flex-col lg:gap-4">
          {/* Price Chart */}
          <div className="glass rounded-2xl flex-1">
            <PriceChart
              round={rounds.live}
              currentPrice={currentPrice}
            />
          </div>

          {/* Previous Rounds */}
          <div className="glass rounded-2xl">
            <PreviousRounds rounds={rounds.expired.slice(0, 2)} />
          </div>
        </div>
      </div>

      {/* Mobile Previous Rounds */}
      <div className="block lg:hidden">
        <div className="glass rounded-2xl">
          <PreviousRounds rounds={rounds.expired.slice(0, 2)} />
        </div>
      </div>

      {/* Tabs Section */}
      <GameTabs
        round={rounds.live}
        currentPrice={currentPrice}
      />

      {/* Modals */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
      <PredictionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        direction={predictionDirection}
        currentPrice={currentPrice}
        payout={nextRoundPayout}
        onConfirm={handlePredictionConfirm}
      />
      <HowToModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}