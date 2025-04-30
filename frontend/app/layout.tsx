import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { RootLayoutWrapper } from './components/RootLayoutWrapper';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>Harwood - Next-gen Crypto Prediction Platform</title>
        <meta name="description" content="Make crypto price predictions and earn rewards" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <RootLayoutWrapper>
            {children}
          </RootLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
