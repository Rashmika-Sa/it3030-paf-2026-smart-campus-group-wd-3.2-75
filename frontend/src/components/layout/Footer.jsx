import React from 'react';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  const dayNumber = today.getDate();
  const monthName = today.toLocaleString('default', { month: 'short' });

  return (
    <footer className="bg-[#222222] border-t border-sliit-gold/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-sliit-gold" />
              <span className="text-xl font-bold tracking-tight text-white">
                SLIIT Smart Campus<span className="text-sliit-gold">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering the next generation of innovators with a unified, intelligent campus management platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">Student Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">Campus Map</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sliit-gold transition-colors text-sm">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact & Calendar */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-5 w-5 text-sliit-gold shrink-0" />
                <span>New Kandy Rd, Malabe 10115, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-sliit-gold shrink-0" />
                <span>+94 11 754 4801</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-sliit-gold shrink-0" />
                <span>info@sliit.lk</span>
              </li>
            </ul>

            {/* Dynamic Calendar Widget */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex items-center gap-4 shadow-inner">
              <div className="bg-sliit-gold text-[#222222] rounded-lg flex flex-col items-center justify-center w-14 h-14 font-bold shrink-0 shadow-md">
                <span className="text-[10px] uppercase tracking-wider">{monthName}</span>
                <span className="text-xl leading-none">{dayNumber}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Today's Date</p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SLIIT Smart Campus. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <span>Built for students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}