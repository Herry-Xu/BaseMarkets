'use client';
import { useSignerStatus, useAuthModal, useAccount } from "@account-kit/react";
import { useGameState } from "@/app/hooks/useGameState";
import { formatUSDC } from "@/app/utils/format";
import Link from "next/link";
import { useState } from "react";
import { SettingsModal } from "./modals/SettingsModal";
import { toast } from "sonner";

export function Header() {
  const { isConnected } = useSignerStatus();
  const { address } = useAccount({ type: 'LightAccount' });
  const { openAuthModal } = useAuthModal();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const userBalance = useGameState((state) => state.userBalance);

  const truncateAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <div className="glass">
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-lg font-bold">Harwood</span>
            </Link>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  {/* Balance with USDC Icon */}
                  <div className="flex items-center gap-2 bg-card-hover px-3 py-1.5 rounded-xl">
                    <div className="w-5 h-5 bg-[#2775CA] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">$</span>
                    </div>
                    <span className="font-medium">{formatUSDC(userBalance)}</span>
                    <button 
                      className="p-1.5 hover:bg-card rounded-lg transition-colors group"
                      title="Add funds"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                        className="w-5 h-5 text-text-secondary opacity-100 group-hover:opacity-60 transition-opacity"
                      >
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Wallet Address with Dropdown */}
                  <div className="relative group">
                    <div className="flex items-center gap-2 bg-card-hover px-3 py-1.5 rounded-xl cursor-pointer">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-primary">
                          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-text-primary">
                        {truncateAddress(address)}
                      </span>
                    </div>

                    {/* Address Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 py-2 bg-card rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110] border border-border-light">
                      <div className="px-4 py-2">
                        <div className="text-sm text-text-secondary mb-2">Wallet Address</div>
                        <div className="flex items-start gap-2">
                          <div className="flex-1 font-mono text-sm text-text-primary bg-card-hover rounded-lg px-3 py-2 break-all">
                            {address}
                          </div>
                          <button 
                            onClick={handleCopyAddress}
                            className="p-2 hover:bg-card-hover rounded-lg transition-colors group shrink-0"
                            title="Copy address"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                              className="w-5 h-5 text-text-secondary opacity-100 group-hover:opacity-60 transition-opacity"
                            >
                              <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                              <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Dropdown */}
                  <div className="relative group">
                    <button 
                      className="p-2 hover:bg-card-hover rounded-lg transition-colors group"
                      title="Menu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                        className="w-6 h-6 text-text-secondary opacity-100 group-hover:opacity-60 transition-opacity"
                      >
                        <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-56 py-2 bg-card rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110] border border-border-light">
                      <button 
                        onClick={() => setSettingsModalOpen(true)}
                        className="w-full px-4 py-2 text-left hover:bg-card-hover flex items-center gap-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-text-secondary">
                          <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-text-secondary">Settings</span>
                      </button>
                      <div className="h-px bg-border-light my-2"></div>
                      <button className="w-full px-4 py-2 text-left hover:bg-card-hover flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-warning">
                          <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-warning">Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button 
                  onClick={openAuthModal}
                  className="bg-gradient-primary text-white font-bold py-2 px-6 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </header>
  );
} 