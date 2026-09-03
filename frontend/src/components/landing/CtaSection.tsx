import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="relative bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-10 md:p-16 text-center border border-blue-800 shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your books. Your teacher. <br className="hidden md:block" /> Your journey.
          </h2>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
            Join 50,000+ learners who turned their PDFs into powerful learning experiences.
          </p>
          <Link to="/c/new" className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-slate-100 px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-xl">
            Start Learning — It's Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
