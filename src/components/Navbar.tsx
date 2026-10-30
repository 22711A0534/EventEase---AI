import React from 'react';
import { Sparkles, Calendar, PlusCircle, MessageSquareText, Layers, Bookmark, BookmarkCheck } from 'lucide-react';
import { EventPlan } from '../types/event';

interface NavbarProps {
  activeTab: 'home' | 'dashboard' | 'chat' | 'saved';
  setActiveTab: (tab: 'home' | 'dashboard' | 'chat' | 'saved') => void;
  openWizard: () => void;
  currentPlan: EventPlan | null;
  onSelectSample: (type: 'wedding' | 'birthday' | 'community') => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openWizard,
  currentPlan,
  onSelectSample,
  savedCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white/10 rounded-[10px] flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-purple-700 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
                EventEase
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 uppercase tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Plan Smarter. Celebrate Better.
            </p>
          </div>
        </div>

        {/* Center Nav links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Home
          </button>

          {currentPlan && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Active Plan</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </button>
          )}

          {/* Saved Plans Tab */}
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-purple-600" />
            <span>Saved Plans</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 border border-purple-200">
                {savedCount}
              </span>
            )}
          </button>

          {/* Sample quick picker */}
          <div className="relative group">
            <button className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all flex items-center gap-1.5 cursor-pointer">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              <span>Sample Plans</span>
            </button>

            <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-54 z-50">
              <div className="bg-white rounded-xl shadow-xl border border-indigo-100 p-2 space-y-1">
                <button
                  onClick={() => onSelectSample('wedding')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">💍</span>
                  <div>
                    <p className="font-semibold">Royal Wedding</p>
                    <p className="text-[10px] text-slate-400">Udaipur • ₹35L</p>
                  </div>
                </button>
                <button
                  onClick={() => onSelectSample('birthday')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">🎂</span>
                  <div>
                    <p className="font-semibold">1st Birthday Party</p>
                    <p className="text-[10px] text-slate-400">Mumbai • ₹50K</p>
                  </div>
                </button>
                <button
                  onClick={() => onSelectSample('community')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">👥</span>
                  <div>
                    <p className="font-semibold">Community Fest</p>
                    <p className="text-[10px] text-slate-400">Bengaluru • ₹8L</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <MessageSquareText className="w-4 h-4 text-blue-500" />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Action Button & Mobile Saved Icon */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('saved')}
            className={`md:hidden p-2 rounded-xl border transition-all flex items-center relative cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-purple-100 text-purple-700 border-purple-300'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Saved Plans"
          >
            <BookmarkCheck className="w-5 h-5 text-purple-600" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={openWizard}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Create New Plan</span>
            <span className="sm:hidden">New Plan</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden border-t border-indigo-50 bg-slate-50/95 px-3 py-1.5 flex items-center justify-around text-xs font-semibold">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1 rounded-lg cursor-pointer ${activeTab === 'home' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600'}`}
        >
          Home
        </button>
        {currentPlan && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600'}`}
          >
            <span>Plan</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
        )}
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer ${activeTab === 'saved' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600'}`}
        >
          <span>Saved</span>
          {savedCount > 0 && (
            <span className={`px-1 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'saved' ? 'bg-white text-purple-700' : 'bg-purple-200 text-purple-800'}`}>
              {savedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1 rounded-lg cursor-pointer ${activeTab === 'chat' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600'}`}
        >
          AI Chat
        </button>
      </div>
    </header>
  );
};
