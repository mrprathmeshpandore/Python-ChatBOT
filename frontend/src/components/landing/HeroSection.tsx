import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
        <Sparkles className="h-4 w-4" />
        AI-POWERED EDUCATION
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
        Turn Any PDF Into Your <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          Personal AI Teacher
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
        Upload your books, notes, or research papers and learn through interactive AI-powered lessons, real-life examples, quizzes, and personalized revision.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/c/new" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
          Start Learning — Free
          <ArrowRight className="h-5 w-5" />
        </Link>
        <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all border border-slate-700">
          See How It Works ↓
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
