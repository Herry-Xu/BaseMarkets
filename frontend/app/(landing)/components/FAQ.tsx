"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div 
      className="border-b border-border-light last:border-none"
      onClick={onToggle}
    >
      <button 
        className="w-full py-6 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium group-hover:text-primary transition-colors">{question}</span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary' : 'bg-text-secondary/10 group-hover:bg-primary/10'}`}>
          <svg 
            className={`w-4 h-4 transition-all ${isOpen ? 'text-white rotate-180' : 'text-text-secondary group-hover:text-primary'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-text-secondary space-y-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What makes Harwood unique?",
      answer: <>
        <p>
          Harwood combines the excitement of crypto trading with the simplicity of binary predictions. Our platform features:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>5-minute prediction rounds for quick results</li>
          <li>Dynamic multipliers based on market sentiment</li>
          <li>Instant payouts via smart contracts</li>
          <li>No complex trading interfaces or order books</li>
        </ul>
        <p className="mt-4">
          Learn more about our features in the <Link href="/docs" className="text-primary hover:opacity-80">documentation</Link>.
        </p>
      </>
    },
    {
      question: "How do I get started?",
      answer: <>
        <p>Getting started with Harwood is simple:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Sign in with email or connect your wallet</li>
          <li>Fund your account with USDC</li>
          <li>Choose UP or DOWN for any active round</li>
          <li>Enter your prediction amount</li>
          <li>Wait for the round to complete</li>
          <li>Collect your winnings instantly if successful</li>
        </ol>
        <p className="mt-4">
          Ready to start? <Link href="/app" className="text-primary hover:opacity-80">Launch the app</Link>
        </p>
      </>
    },
    {
      question: "Is my money safe?",
      answer: <>
        <p>
          Security is our top priority. Your funds are protected by:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Audited smart contracts by leading security firms</li>
          <li>Comprehensive platform insurance</li>
          <li>Transparent on-chain transactions</li>
          <li>Regular security assessments</li>
        </ul>
        <p className="mt-4">
          View our security measures and audit reports in our <Link href="/docs/security" className="text-primary hover:opacity-80">security documentation</Link>.
        </p>
      </>
    },
    {
      question: "What are the fees?",
      answer: <>
        <p>
          Our fee structure is simple and transparent:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>3% platform fee on winning predictions</li>
          <li>No fees on unsuccessful predictions</li>
          <li>Standard network gas fees apply</li>
        </ul>
        <p className="mt-4">
          Platform fees contribute to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Insurance fund (40%)</li>
          <li>Platform development (30%)</li>
          <li>Community rewards (30%)</li>
        </ul>
      </>
    }
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="divide-y divide-border-light">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 