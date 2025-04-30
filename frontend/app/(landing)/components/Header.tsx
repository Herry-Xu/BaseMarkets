"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
      onClick={(e) => {
        if (href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            const offset = 80; // Height of fixed header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
          if (onClick) onClick();
        }
      }}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it Works</NavLink>
              <NavLink href="/docs">Docs</NavLink>
            </nav>
            <Link 
              href="/app" 
              className="bg-gradient-primary text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
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
              <NavLink href="#features" onClick={() => setIsOpen(false)}>
                Features
              </NavLink>
              <NavLink href="#how-it-works" onClick={() => setIsOpen(false)}>
                How it Works
              </NavLink>
              <NavLink href="/docs" onClick={() => setIsOpen(false)}>
                Docs
              </NavLink>
              <Link 
                href="/app" 
                className="bg-gradient-primary text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity text-center"
                onClick={() => setIsOpen(false)}
              >
                Launch App
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 