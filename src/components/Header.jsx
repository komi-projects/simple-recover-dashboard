import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      <div className="hidden md:flex items-center gap-2 ml-4 flex-1 max-w-md">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search payments, customers..."
          className="w-full text-sm bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-xs font-bold text-white">
          JD
        </div>
      </div>
    </header>
  );
}
