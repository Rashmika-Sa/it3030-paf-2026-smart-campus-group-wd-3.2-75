import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      
      <main className="pt-20"> 
        <Hero />
        <Features /> 
    
      </main>

      <Footer />
    </>
  );
}