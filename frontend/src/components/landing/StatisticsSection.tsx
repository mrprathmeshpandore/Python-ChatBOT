import React from 'react';

const StatisticsSection = () => {
  const stats = [
    { value: '50,000+', label: 'Students Learning' },
    { value: '2.4M+', label: 'PDFs Processed' },
    { value: '98%', label: 'Quiz Accuracy' },
    { value: '4.9★', label: 'User Rating' },
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800/0 md:divide-slate-800">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-slate-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
