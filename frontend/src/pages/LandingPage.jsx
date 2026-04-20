import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
// import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
// import HowItWorks from '../components/landing/HowItWorks';
// import CTA from '../components/landing/CTA';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      
      <main className="pt-20"> 
        <Hero />
        {/* <Stats /> */}
        <Features /> 
        {/* <HowItWorks /> */}
        {/* <CTA /> */}
      </main>

      <Footer />
    </>
  );
}