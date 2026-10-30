import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Utensils, 
  Mail, 
  Copy, 
  Check, 
  Wine, 
  Camera, 
  Compass, 
  Layers,
  HeartHandshake,
  Lightbulb
} from 'lucide-react';
import { EventPlan } from '../types/event';

interface PersonalizedIdeasProps {
  plan: EventPlan;
}

export const PersonalizedIdeas: React.FC<PersonalizedIdeasProps> = ({ plan }) => {
  const [activeSubTab, setActiveSubTab] = useState<'themes' | 'decor' | 'food' | 'invitations'>('themes');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { creativeIdeas } = plan;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('themes')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'themes'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Palette className="w-4 h-4 text-purple-600" />
          <span>Creative Themes</span>
        </button>

        <button
          onClick={() => setActiveSubTab('decor')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'decor'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Decor & Staging</span>
        </button>

        <button
          onClick={() => setActiveSubTab('food')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'food'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Utensils className="w-4 h-4 text-amber-600" />
          <span>Food & Beverage</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invitations')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'invitations'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Mail className="w-4 h-4 text-blue-600" />
          <span>Invitations & RSVP</span>
        </button>
      </div>

      {/* 1. Creative Themes */}
      {activeSubTab === 'themes' && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              AI-Curated Aesthetic Themes & Color Palettes
            </h3>
            <p className="text-xs text-slate-500">
              Harmonious color codes, vibe keywords, and guest attire recommendations crafted for {plan.input.location}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creativeIdeas?.themes?.map((theme, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  {/* Color Palette Swatches */}
                  <div className="flex rounded-2xl overflow-hidden h-14 shadow-inner border border-slate-100">
                    {theme.colorPalette?.map((swatch, sIdx) => (
                      <div
                        key={sIdx}
                        title={`${swatch.name} (${swatch.hex})`}
                        className="flex-1 flex flex-col justify-end p-1.5 transition-all hover:scale-105"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        <span className="text-[9px] font-mono font-bold bg-black/40 text-white px-1 rounded-sm backdrop-blur-xs truncate text-center">
                          {swatch.hex}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
                      Concept #{idx + 1}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mt-0.5">{theme.name}</h4>
                    <p className="text-xs font-semibold text-indigo-700 italic mt-0.5">
                      "{theme.tagline}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {theme.description}
                  </p>

                  {/* Vibe Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {theme.vibeTags?.map((vibe, vIdx) => (
                      <span
                        key={vIdx}
                        className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100"
                      >
                        #{vibe}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dress Code Box */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Suggested Guest Attire:</span>
                  </div>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    {theme.dressCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Decor & Staging */}
      {activeSubTab === 'decor' && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Thematic Decor & Staging Concepts
            </h3>
            <p className="text-xs text-slate-500">
              Spatial layouts, entrance installations, photo-booths, and ambient lighting designed to captivate your guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creativeIdeas?.decorSuggestions?.map((decor, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {idx === 0 ? <Compass className="w-5 h-5" /> : idx === 1 ? <Sparkles className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                    Zone Focus
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{decor.area}</h4>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {decor.idea}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Decorative Elements:
                  </span>
                  <ul className="space-y-1.5">
                    {decor.elements?.map((el, elIdx) => (
                      <li key={elIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Food & Beverage */}
      {activeSubTab === 'food' && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Gourmet Culinary Menu & Catering Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Thoughtfully curated for {plan.input.guestCount} guests in {plan.input.location}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Welcome Drinks */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                <span className="p-2 rounded-xl bg-pink-50 text-pink-600">
                  <Wine className="w-4 h-4" />
                </span>
                <span>Signature Welcome Drinks & Refreshers</span>
              </div>
              <ul className="space-y-2 pt-1">
                {creativeIdeas?.foodAndBeverage?.welcomeDrinks?.map((drink, idx) => (
                  <li key={idx} className="text-xs text-slate-700 bg-pink-50/40 p-2.5 rounded-xl border border-pink-100 flex items-center gap-2 font-medium">
                    <span className="text-pink-600">🍹</span>
                    <span>{drink}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Appetizers */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Utensils className="w-4 h-4" />
                </span>
                <span>Hors d'Oeuvres & Live Appetizer Counters</span>
              </div>
              <ul className="space-y-2 pt-1">
                {creativeIdeas?.foodAndBeverage?.appetizers?.map((app, idx) => (
                  <li key={idx} className="text-xs text-slate-700 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100 flex items-center gap-2 font-medium">
                    <span className="text-amber-600">🍢</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Course */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Utensils className="w-4 h-4" />
                </span>
                <span>Main Course Highlights & Regional Specialties</span>
              </div>
              <ul className="space-y-2 pt-1">
                {creativeIdeas?.foodAndBeverage?.mainCourseHighlights?.map((dish, idx) => (
                  <li key={idx} className="text-xs text-slate-700 bg-purple-50/40 p-2.5 rounded-xl border border-purple-100 flex items-center gap-2 font-medium">
                    <span className="text-purple-600">🍲</span>
                    <span>{dish}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dessert Stations */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span>Live Dessert Stations & Sweet Delights</span>
              </div>
              <ul className="space-y-2 pt-1">
                {creativeIdeas?.foodAndBeverage?.dessertStations?.map((dessert, idx) => (
                  <li key={idx} className="text-xs text-slate-700 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2 font-medium">
                    <span className="text-indigo-600">🍨</span>
                    <span>{dessert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Catering Tips */}
          {creativeIdeas?.foodAndBeverage?.cateringTips?.length > 0 && (
            <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-emerald-700" />
                <span>Executive Catering Tips:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {creativeIdeas.foodAndBeverage.cateringTips.map((tip, idx) => (
                  <div key={idx} className="text-xs text-emerald-950 flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Invitations & RSVP */}
      {activeSubTab === 'invitations' && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Invitations Suite & Digital Copy
            </h3>
            <p className="text-xs text-slate-500">
              Copy-paste ready wording for WhatsApp, formal cards, and aesthetic prompts for graphic designers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Invite Template */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    WhatsApp / Digital Invite Text
                  </span>
                  <button
                    onClick={() => handleCopy(creativeIdeas?.invitations?.whatsappMessageTemplate || '', 'whatsapp')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'whatsapp' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                  {creativeIdeas?.invitations?.whatsappMessageTemplate || 'No message template available.'}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Ready to paste into WhatsApp family groups or broadcast lists.
              </p>
            </div>

            {/* Formal Invitation Card Wording */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    Formal Invitation Card Wording
                  </span>
                  <button
                    onClick={() => handleCopy(creativeIdeas?.invitations?.formalInvitationText || '', 'formal')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'formal' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-purple-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-serif italic">
                  "{creativeIdeas?.invitations?.formalInvitationText || 'Together with our families, we invite you...'}"
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Recommended for printed physical cards and elder relatives.
              </p>
            </div>

            {/* Graphic Designer / Canva Prompt */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Canva / Graphic Designer Prompt
                </span>
                <button
                  onClick={() => handleCopy(creativeIdeas?.invitations?.designAestheticPrompt || '', 'canva')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                >
                  {copiedKey === 'canva' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-600 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 font-mono text-[11px]">
                {creativeIdeas?.invitations?.designAestheticPrompt || 'Elegant luxury event invitation design with rich typography.'}
              </p>
              <p className="text-[11px] text-slate-400">
                Paste directly into Canva, Midjourney, or share with your stationery printer.
              </p>
            </div>

            {/* RSVP Timeline Advisory */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  RSVP & Headcount Advisory
                </span>
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 mt-2">
                  <p className="text-xs font-semibold text-amber-950">
                    {creativeIdeas?.invitations?.rsvpDeadlineRecommendation || 'Recommend sending RSVPs 4-6 weeks prior to event date.'}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Helps lock exact plate counts with caterers before penalty deadlines.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
