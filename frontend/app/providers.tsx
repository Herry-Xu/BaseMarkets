"use client";
import { config, queryClient } from "@/config";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { PropsWithChildren } from "react";

export const Providers = ({
  children,
  initialState,
}: PropsWithChildren<{ initialState?: AlchemyClientState }>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={config}
        queryClient={queryClient}
        initialState={initialState}
      >
        <Toaster 
          theme="light"
          position="top-center"
          offset="80px"
          toastOptions={{
            style: {
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)',
            },
            className: "sonner-toast",
            classNames: {
              success: "bg-gradient-success text-white border-0",
              error: "bg-gradient-warning text-white border-0",
              warning: "bg-gradient-primary text-white border-0",
              info: "bg-gradient-primary text-white border-0",
            },
            duration: 4000,
          }}
        />
        {children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
};
