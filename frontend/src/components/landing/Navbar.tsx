import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer">
            <GraduationCap className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-slate-100 tracking-tight">Personal AI Teacher</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/c/new" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link to="/c/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
