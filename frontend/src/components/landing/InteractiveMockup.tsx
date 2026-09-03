import React from 'react';
import { BookOpen, CheckCircle, RefreshCcw, Lightbulb, Send } from 'lucide-react';

const InteractiveMockup = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-24">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Chapters
          </div>
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            {['Introduction', 'Variables', 'Functions', 'Data Types'].map((chapter, idx) => (
              <div 
                key={idx} 
                className={`px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 cursor-pointer transition-colors ${
                  idx === 1 ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {chapter}
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900 relative">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* AI Teacher Message */}
            <div className="flex gap-4 max-w-2xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-white text-lg">🎓</span>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-slate-200 leading-relaxed shadow-sm">
                  Great! Let's explore Variables. Think of a variable like a labeled box — you store a value inside, and you can change what's in the box anytime.
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle className="h-4 w-4" /> I Understand
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-sm font-medium hover:bg-slate-700 transition-colors">
                    <RefreshCcw className="h-4 w-4" /> Explain Again
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-sm font-medium hover:bg-slate-700 transition-colors">
                    <Lightbulb className="h-4 w-4" /> Give Example
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask your teacher anything..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3.5 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                readOnly
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMockup;
