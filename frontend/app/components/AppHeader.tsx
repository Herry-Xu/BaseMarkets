"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignerStatus, useAuthModal, useAccount } from "@account-kit/react";
import { useGameState } from "@/app/hooks/useGameState";
import { formatUSDC } from "@/app/utils/format";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className="text-text-secondary hover:text-primary transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isConnected } = useSignerStatus();
  const { address } = useAccount({ type: 'LightAccount' });
  const { openAuthModal } = useAuthModal();
  const userBalance = useGameState((state) => state.userBalance);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const truncateAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 ${
      scrolled ? 'backdrop-blur-md border-b border-border-light bg-white/50' : ''
    }`}>
      <div className="w-full max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold">Harwood</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {isConnected && (
                <div className="flex items-center gap-2 px-4 py-2 bg-card-hover rounded-xl">
                  <span className="text-text-secondary">Balance:</span>
                  <span className="font-mono font-bold">{formatUSDC(userBalance)}</span>
                </div>
              )}
            </nav>
            {isConnected ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-card-hover rounded-xl hover:bg-card-hover/80 transition-colors">
                  <span className="font-mono">{truncateAddress(address)}</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-border-light">
                  <button className="w-full px-4 py-2 text-left hover:bg-card-hover text-warning">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={openAuthModal}
                className="bg-gradient-primary text-white font-bold py-2 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <span className={`block w-full h-0.5 bg-text-primary transition-all ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`} />
              <span className={`block w-full h-0.5 bg-text-primary transition-all ${
                isOpen ? 'opacity-0' : ''
              }`} />
              <span className={`block w-full h-0.5 bg-text-primary transition-all ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border-light"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-6">
              <NavLink href="/history" onClick={() => setIsOpen(false)}>
                History
              </NavLink>
              <NavLink href="/leaderboard" onClick={() => setIsOpen(false)}>
                Leaderboard
              </NavLink>
              {isConnected ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-card-hover rounded-xl">
                    <span className="text-text-secondary">Balance:</span>
                    <span className="font-mono font-bold">{formatUSDC(userBalance)}</span>
                  </div>
                  <button className="w-full text-left text-warning px-4 py-2 hover:bg-card-hover rounded-xl">
                    Sign out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    openAuthModal();
                  }}
                  className="bg-gradient-primary text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity text-center"
                >
                  Sign in
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 