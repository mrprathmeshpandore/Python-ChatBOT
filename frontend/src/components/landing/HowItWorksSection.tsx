import React from 'react';
import { UploadCloud, BrainCircuit, Sparkles } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: <UploadCloud className="h-8 w-8 text-blue-400" />,
      title: 'Upload',
      description: 'Drop your PDF — textbook, notes, or research paper. Any document works.',
    },
    {
      number: '02',
      icon: <BrainCircuit className="h-8 w-8 text-indigo-400" />,
      title: 'Understand',
      description: 'The AI reads, analyzes, and maps your document into a structured learning path.',
    },
    {
      number: '03',
      icon: <Sparkles className="h-8 w-8 text-emerald-400" />,
      title: 'Learn',
      description: 'Your personal AI teacher explains topics, tests you, and tracks your progress.',
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">How It Works</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white">Three steps to smarter learning</h3>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
          No setup. No configuration. Upload your document and meet your teacher in seconds.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-emerald-500/20 -translate-y-1/2 -z-10"></div>

        {steps.map((step, idx) => (
          <div key={idx} className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors group text-center">
            <div className="absolute -top-4 -right-4 text-7xl font-black text-slate-800/30 select-none transition-all group-hover:text-slate-800/50">
              {step.number}
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
              {step.icon}
            </div>
            <h4 className="text-xl font-bold text-slate-200 mb-3">{step.title}</h4>
            <p className="text-slate-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
