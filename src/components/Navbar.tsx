import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">LUMERAY</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
          Log in
        </Link>
        <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          Get Started
        </Link>
      </div>
    </nav>
  );
};
