"use client";
import { motion } from 'framer-motion';

interface PartnerLogoProps {
  name: string;
  logo: React.ReactNode;
  delay?: number;
}

function PartnerLogo({ name, logo, delay = 0 }: PartnerLogoProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass p-6 rounded-2xl hover:shadow-lg transition-all group"
    >
      <div className="flex items-center justify-center h-16 opacity-60 group-hover:opacity-100 transition-opacity">
        {logo}
      </div>
    </motion.div>
  );
}

export function Partners() {
  const partners = [
    {
      name: "Chainlink",
      logo: (
        <svg className="w-32 h-8 text-[#375BD2]" viewBox="0 0 152 32" fill="currentColor">
          <path d="M25.0885 10.2619L16.7619 1.93531C16.5873 1.76986 16.3808 1.63816 16.1533 1.54754C15.9258 1.45692 15.682 1.40894 15.4359 1.40625C15.1897 1.40357 14.9448 1.44622 14.7153 1.53181C14.4858 1.6174 14.2764 1.74437 14.0982 1.90578L5.77163 10.2619C5.60273 10.4365 5.46903 10.6442 5.37728 10.8732C5.28552 11.1022 5.23731 11.3476 5.23535 11.5954C5.23339 11.8431 5.27772 12.0894 5.36583 12.3201C5.45394 12.5508 5.58428 12.761 5.75037 12.9385L14.0771 21.2652C14.2516 21.4306 14.4582 21.5623 14.6857 21.6529C14.9132 21.7435 15.157 21.7915 15.4031 21.7942C15.6493 21.7969 15.8942 21.7542 16.1237 21.6686C16.3532 21.583 16.5626 21.4561 16.7408 21.2947L25.0674 12.9385C25.2363 12.7639 25.37 12.5562 25.4617 12.3272C25.5535 12.0982 25.6017 11.8528 25.6037 11.605C25.6056 11.3573 25.5613 11.111 25.4732 10.8803C25.3851 10.6496 25.2547 10.4394 25.0886 10.2619H25.0885Z"/>
        </svg>
      )
    },
    {
      name: "Alchemy",
      logo: (
        <svg className="w-32 h-8 text-[#0C0C0E]" viewBox="0 0 87 24" fill="currentColor">
          <path d="M11.9 13.0999L18.8 2.19995H13.2L8.9 9.09995L4.6 2.19995H0L6.9 13.0999L0 23.9999H4.6L8.9 17.0999L13.2 23.9999H17.8L11.9 13.0999Z"/>
        </svg>
      )
    },
    {
      name: "Base",
      logo: (
        <svg className="w-32 h-8" viewBox="0 0 128 32" fill="none">
          <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: "Sepolia",
      logo: (
        <svg className="w-32 h-8" viewBox="0 0 128 32" fill="none">
          <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 22L22 16L16 10L10 16L16 22Z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powered By</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Built on trusted blockchain infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <PartnerLogo
              key={index}
              {...partner}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Integration Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-text-secondary">Oracle Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{"<"}2s</div>
                <div className="text-text-secondary">Price Updates</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4</div>
                <div className="text-text-secondary">Price Feeds</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 