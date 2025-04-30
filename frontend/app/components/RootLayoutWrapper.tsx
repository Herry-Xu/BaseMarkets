'use client';
import { usePathname } from 'next/navigation';
import { Header } from "@/app/(landing)/components/Header";
import { Footer } from "@/app/(landing)/components/Footer";
import { AppHeader } from "./AppHeader";

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const isAppRoute = usePathname()?.startsWith('/app');

  return (
    <div className="min-h-screen flex flex-col">
      {isAppRoute ? <AppHeader /> : <Header />}
      <main className={`flex-1 ${isAppRoute ? 'pt-20' : ''}`} role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
} 