import React from 'react';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-bold text-slate-200">Personal AI Teacher</span>
        </div>
        
        <div className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Personal AI Teacher. All rights reserved.
        </div>
        
        <div className="flex space-x-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
