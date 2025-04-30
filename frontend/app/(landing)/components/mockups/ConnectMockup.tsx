"use client";

export function ConnectMockup() {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex flex-col gap-6">
        {/* Email Sign In */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-medium">Sign in with Email</span>
          </div>
          <div className="bg-card-hover rounded-xl p-4">
            <div className="h-10 bg-white rounded-lg"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border-light"></div>
          <span className="text-text-secondary">or</span>
          <div className="flex-1 h-px bg-border-light"></div>
        </div>

        {/* Wallet Connect */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-medium">Connect Wallet</span>
          </div>
          <div className="bg-card-hover rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-white rounded-lg"></div>
              <div className="h-16 bg-white rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 