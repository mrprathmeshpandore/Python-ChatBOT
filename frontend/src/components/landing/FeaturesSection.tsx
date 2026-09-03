import React from 'react';
import { GraduationCap, BookText, Brain, MessageSquareText, TrendingUp, RefreshCw } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <GraduationCap className="h-6 w-6 text-blue-400" />,
      title: 'AI Teacher',
      description: 'Get clear explanations, real-life examples, and guided learning from an AI that adapts to your pace.'
    },
    {
      icon: <BookText className="h-6 w-6 text-emerald-400" />,
      title: 'Smart Notes',
      description: 'Automatically generated chapter summaries, key concepts, and exam-focused revision notes.'
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      title: 'Interactive Quizzes',
      description: 'Test your understanding with AI-generated MCQs, true/false, and short-answer questions.'
    },
    {
      icon: <MessageSquareText className="h-6 w-6 text-pink-400" />,
      title: 'Chat With PDF',
      description: 'Ask anything about your document. Get precise answers with source page references.'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
      title: 'Progress Tracking',
      description: 'Visualize your learning journey. Know your strong and weak topics at a glance.'
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-indigo-400" />,
      title: 'Smart Revision',
      description: 'AI identifies your weak topics and creates personalized revision sessions.'
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Features</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white">Everything you need to learn deeply</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/80 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-6 border border-slate-800">
              {feature.icon}
            </div>
            <h4 className="text-xl font-semibold text-slate-200 mb-3">{feature.title}</h4>
            <p className="text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
