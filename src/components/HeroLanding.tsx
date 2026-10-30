import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Cake, 
  Users, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Palette, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Gift
} from 'lucide-react';
import { EventType } from '../types/event';

interface HeroLandingProps {
  onStartPlanning: (eventType?: EventType) => void;
  onSelectSample: (type: 'wedding' | 'birthday' | 'community') => void;
  openChat: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartPlanning,
  onSelectSample,
  openChat,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-linear-to-b from-purple-200/50 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-blue-300/20 rounded-full blur-2xl pointer-events-none -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-purple-100 to-indigo-100 border border-purple-200/80 text-purple-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Plan Smarter. Celebrate Better. Make Every Event Memorable.</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Effortless Event Planning,{' '}
            <span className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Powered by AI.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
            Whether it’s a fairytale wedding in Udaipur, a magical milestone birthday, or a grand community festival, EventEase AI calculates your budget in INR, schedules your timeline, prepares vendor checklists, and crafts bespoke themes in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onStartPlanning()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>Generate AI Event Masterplan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={openChat}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-indigo-200 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Assistant</span>
            </button>
          </div>

          {/* Mini Highlights Pill row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Realistic INR Budget Breakdown
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Phased Timelines & Deadlines
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <Palette className="w-3.5 h-3.5 text-purple-600" /> Themes & Digital Invites
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Vendor Interview Checklists
            </span>
          </div>
        </div>
      </section>

      {/* 3 Main Event Selection Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Select Your Event Type
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
            Choose what you are celebrating. Our AI tailors custom budget percentages, vendor contracts, and countdown timelines specifically for your occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Wedding */}
          <div className="group relative bg-white rounded-2xl border border-purple-100 hover:border-purple-300 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-purple-100 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 shadow-2xs group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 fill-purple-600/20 text-purple-600" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Fairytales & Heritage
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Weddings</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Grand palace ceremonies, intimate beach vows, sangeet choreographies, mandap decor, and multi-day meal arrangements.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="text-xs text-slate-500 font-medium">Includes:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium">Mandap & Florals</span>
                  <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium">Candid Cinema</span>
                  <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium">Sangeet DJ</span>
                  <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium">Mehendi Menus</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => onStartPlanning('wedding')}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Plan Wedding with AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectSample('wedding')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors text-center"
              >
                View Udaipur Royal Wedding Sample (₹35L)
              </button>
            </div>
          </div>

          {/* Card 2: Birthday */}
          <div className="group relative bg-white rounded-2xl border border-blue-100 hover:border-blue-300 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-100 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-2xs group-hover:scale-110 transition-transform">
                <Cake className="w-7 h-7 text-blue-600" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Joyous Milestones
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Birthday Parties</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  First year cake smash, superhero & astronaut kids parties, sweet 16s, and luxury 30th & 50th milestone dinner parties.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="text-xs text-slate-500 font-medium">Includes:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">Custom Cake Design</span>
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">Balloon Arches</span>
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">Magic & Emcee</span>
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">Return Favors</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => onStartPlanning('birthday')}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Plan Birthday with AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectSample('birthday')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors text-center"
              >
                View 1st Birthday Party Sample (₹50K)
              </button>
            </div>
          </div>

          {/* Card 3: Community Event */}
          <div className="group relative bg-white rounded-2xl border border-indigo-100 hover:border-indigo-300 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-indigo-100 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-2xs group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-indigo-600" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Shared Celebrations
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Community Events</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Society Diwali & Holi melas, sports days, cultural fests, NGO charity galas, and resident association conferences.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="text-xs text-slate-500 font-medium">Includes:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">Stage & LED Wall</span>
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">Flea Market Stalls</span>
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">Permits & Safety</span>
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">Zero Waste Cleanup</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => onStartPlanning('community')}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Plan Community Event</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectSample('community')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors text-center"
              >
                View Bengaluru Diwali Mela Sample (₹8L)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Walkthrough Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Complete Event Intelligence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Everything You Need to Host an Unforgettable Gathering
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              No more messy spreadsheets or forgotten contracts. EventEase AI unifies budget, timeline, vendors, creative themes, and on-demand AI guidance into one clean workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                <IndianRupee className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">1. AI Budget Breakdown (INR)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Smart category percentages, actual spend tracking, and realistic negotiation hacks that save up to 25% without sacrificing quality.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">2. Phased Timeline & Run-of-Show</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Milestones mapped from 9 months before to the hour-by-hour itinerary of the big day, with interactive completion checklists.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">3. Vendor Matrix & Interview Questions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Avoid hidden fees and surprises with pre-vetted questions for caterers, decorators, cinematographers, and sound engineers.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-300">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">4. Bespoke Themes & Decor Palettes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Curated hex palettes, stage and entrance concepts, plus creative photobooths that make your event visual and memorable.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">5. Menus & Digital WhatsApp Invites</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Regional and fusion delicacies, live stations, dessert setups, plus ready-to-paste WhatsApp copy and Canva design prompts.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">6. Always-On AI Event Copilot</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ask anything in natural language—from contract questions to menu tweaks. Our Gemini-powered assistant knows your specific event context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works 3-step section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How EventEase AI Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-700 font-extrabold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900">Share Your Event Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tell us your occasion, city, guest count, and budget in INR. Add any preferences like outdoor lawn, live Sufi band, or pure vegetarian menus.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900">AI Synthesizes Masterplan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In seconds, Gemini crafts an itemized budget split, timeline milestones, vendor checklists, and custom theme designs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 font-extrabold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900">Track, Customize & Celebrate</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tick off tasks, update actual spends, copy WhatsApp invites, print the master brief, and converse with the AI copilot anytime.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onStartPlanning()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Your Plan Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
