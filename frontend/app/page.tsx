import { Hero } from '@/app/(landing)/components/Hero';
import { Features } from '@/app/(landing)/components/Features';
import { HowItWorks } from '@/app/(landing)/components/HowItWorks';
import { Stats } from '@/app/(landing)/components/Stats';
import { Partners } from '@/app/(landing)/components/Partners';
import { Security } from '@/app/(landing)/components/Security';
import { FAQ } from '@/app/(landing)/components/FAQ';

export default function Page() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Partners />
      <Security />
      <FAQ />
    </>
  );
}
