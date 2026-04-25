import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 min-h-screen bg-gray-50 text-[#222222]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <h1 className="text-3xl font-bold text-[#222222] mb-3">Dashboard Cleared</h1>
            <p className="text-gray-600 text-base">
              All previous dashboard components and backend wiring have been removed.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
