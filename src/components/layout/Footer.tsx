import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="h-10 bg-slate-100 border-t border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
      <div>Last data sync: Today at 09:42 AM</div>
      <div className="flex gap-4 sm:gap-6">
        <span>Server: PROD-US-WEST-1</span>
        <span>v2.4.0-STABLE</span>
      </div>
    </footer>
  );
};
