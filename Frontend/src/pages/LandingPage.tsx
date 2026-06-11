import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Experience from '@/components/sections/Experience';
import Membership from '@/components/sections/Membership';
import MobileShowcase from '@/components/sections/MobileShowcase';

export default function LandingPage() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <Features />
      <Experience />
      <Membership />
      <MobileShowcase />
      <Footer />
    </div>
  );
}
