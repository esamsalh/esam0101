
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fa-solid fa-file-invoice text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">VisionOCR</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-indigo-600">Documentation</a>
              <a href="#" className="hover:text-indigo-600">Support</a>
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <button className="text-sm font-medium text-indigo-600 flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors">
              <i className="fa-solid fa-globe"></i>
              <span>العربية</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
