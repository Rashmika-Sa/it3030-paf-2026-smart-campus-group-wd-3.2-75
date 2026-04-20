import React from 'react';
import { CalendarCheck, BookOpen, Ticket, Bell, Building, Users } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Smart Facility Booking",
      description: "Instantly reserve study rooms, labs, and sports facilities with our real-time availability calendar.",
      icon: <CalendarCheck className="w-8 h-8 text-sliit-gold" />,
      delay: "0.1s"
    },
    {
      title: "Academic Resources",
      description: "One-click access to past papers, lecture notes, and library databases integrated into your dashboard.",
      icon: <BookOpen className="w-8 h-8 text-sliit-gold" />,
      delay: "0.2s"
    },
    {
      title: "IT Helpdesk & Tickets",
      description: "Raise support tickets for campus Wi-Fi, lab computers, or account issues and track them in real-time.",
      icon: <Ticket className="w-8 h-8 text-sliit-gold" />,
      delay: "0.3s"
    },
    {
      title: "Real-time Notifications",
      description: "Never miss a beat. Get instant alerts for timetable changes, exam results, and campus announcements.",
      icon: <Bell className="w-8 h-8 text-sliit-gold" />,
      delay: "0.4s"
    },
    {
      title: "Interactive Campus Map",
      description: "Navigate the Malabe campus effortlessly. Find lecture halls, cafeterias, and admin offices with ease.",
      icon: <Building className="w-8 h-8 text-sliit-gold" />,
      delay: "0.5s"
    },
    {
      title: "Clubs & Societies",
      description: "Discover campus life. Join clubs, view upcoming events, and collaborate with your peers.",
      icon: <Users className="w-8 h-8 text-sliit-gold" />,
      delay: "0.6s"
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-sliit-gold font-bold tracking-wide uppercase text-sm mb-3">
            Why SLIIT Smart Campus?
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#222222] mb-4">
            Everything you need, right at your fingertips.
          </h3>
          <p className="text-gray-500 text-lg">
            Say goodbye to jumping between different portals. We've brought all your essential campus services into one powerful, unified dashboard.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              // UPDATED: Added flex column centering, thicker border, stronger default shadow, and a gold border on hover
              className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-md hover:shadow-2xl hover:border-sliit-gold hover:-translate-y-2 transition-all duration-300 group animate-slide-up flex flex-col items-center text-center"
              style={{ animationDelay: feature.delay }}
            >
              {/* UPDATED: Increased icon container size slightly to give it more weight at the top center */}
              <div className="w-16 h-16 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-yellow-100 transition-all duration-300 shadow-sm">
                {feature.icon}
              </div>
              
              <h4 className="text-xl font-bold text-[#222222] mb-3 group-hover:text-yellow-600 transition-colors">
                {feature.title}
              </h4>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}