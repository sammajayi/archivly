import { Hero } from './Hero';
import { Problem } from './Problem';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { SocialProof } from './SocialProof';
import { Pricing } from './Pricing';
import { Footer } from './Footer';

export function FullLanding() {
  return (
    <main>
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <SocialProof />
      <Pricing />
      <Footer />
    </main>
  );
}
