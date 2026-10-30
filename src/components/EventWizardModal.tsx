import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Heart, 
  Cake, 
  Users, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Sliders, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Loader2,
  Wand2
} from 'lucide-react';
import { EventType, EventInput, EventPlan } from '../types/event';
import { POPULAR_LOCATIONS, PRESET_BUDGETS } from '../data/samplePlans';

interface EventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: EventPlan) => void;
  initialEventType?: EventType;
}

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
  initialEventType = 'wedding',
}) => {
  const [step, setStep] = useState<number>(1);
  const [eventType, setEventType] = useState<EventType>(initialEventType);
  const [subType, setSubType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('18:00');
  const [location, setLocation] = useState<string>('Udaipur, Rajasthan');
  const [guestCount, setGuestCount] = useState<number>(250);
  const [budgetINR, setBudgetINR] = useState<number>(1500000);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Modern & Elegant',
    'Gourmet Foodie Experience'
  ]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset options based on event type
  const eventSubtypes: Record<EventType, string[]> = {
    wedding: [
      'Royal Heritage Palace Wedding',
      'Intimate Beach & Sunset Vows',
      'Traditional Cultural Ceremony',
      'Contemporary Luxury Sangeet & Reception',
      'Eco-Friendly Garden Wedding'
    ],
    birthday: [
      '1st Birthday Milestone Wonderland',
      'Thematic Kids Superhero & Magic Bash',
      'Teen Sweet 16 Glow Party',
      'Luxury 30th / 40th / 50th Milestone Soirée',
      'Casual Outdoor Picnic & High Tea'
    ],
    community: [
      'Neighborhood Diwali / Holi Mela',
      'Society Cultural Fest & Talent Night',
      'Charity Gala & Silent Auction',
      'Tech Meetup & Youth Hackathon Showcase',
      'Sports Day & Family Carnival'
    ]
  };

  const preferenceOptions: Record<EventType, string[]> = {
    wedding: [
      'Royal Heritage Decor',
      'Live Sufi / Fusion Band',
      'Pure Vegetarian / Jain Options',
      'Drone Cinematography',
      'Cocktail Bar & Mocktails',
      'Outdoor Lawn Mandap',
      'Eco-Friendly / Low Waste',
      'Celebrity Wedding DJ'
    ],
    birthday: [
      'Magician & Interactive Host',
      'Pastel Balloon Arch & Neon Signs',
      'Low-Sugar Organic Toddler Cake',
      'Live Wood-Fired Pizza & Pasta Station',
      'Toddler Soft-Play Arena',
      'Instant Polaroid Photobooth',
      'Curated Return Favors',
      'Face Painting & Tattoo Artist'
    ],
    community: [
      'Zero Single-Use Plastic',
      'Covered Stage & LED Screen',
      'Artisan Flea Market Stalls',
      'Traditional Folk Dance Performances',
      'Resident Cooking Contest',
      'Wheelchair Accessible Amenities',
      'Dedicated First-Aid & Security',
      'Multi-generational Seating'
    ]
  };

  const handleEventTypeSelect = (type: EventType) => {
    setEventType(type);
    if (!subType || !eventSubtypes[type].includes(subType)) {
      setSubType(eventSubtypes[type][0]);
    }
    // Set sensible defaults if user hasn't typed a title
    if (!title || title.includes('Wedding') || title.includes('Birthday') || title.includes('Carnival')) {
      if (type === 'wedding') {
        setTitle('Aarav & Maya’s Wedding');
        setBudgetINR(2500000);
        setGuestCount(300);
      } else if (type === 'birthday') {
        setTitle('Aria’s Magical 1st Birthday');
        setBudgetINR(350000);
        setGuestCount(80);
      } else {
        setTitle('Greenwood Annual Cultural Fest 2026');
        setBudgetINR(750000);
        setGuestCount(500);
      }
    }
  };

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const inputData: EventInput = {
      eventType,
      subType: subType || eventSubtypes[eventType][0],
      title: title || `${eventType.toUpperCase()} Celebration`,
      date: date || '2026-11-20',
      time,
      location: location || 'Mumbai, Maharashtra',
      guestCount: Number(guestCount) || 100,
      budgetINR: Number(budgetINR) || 1000000,
      preferences: selectedPreferences,
      customNotes
    };

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate event plan (HTTP ${response.status})`);
      }

      const generatedPlan: EventPlan = await response.json();
      onPlanCreated(generatedPlan);
      onClose();
    } catch (err: any) {
      console.error('Error generating plan:', err);
      setErrorMsg(err.message || 'An error occurred while generating the plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-700 via-indigo-700 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Wand2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">EventEase AI Planner</h3>
              <p className="text-xs text-purple-100">
                Step {step} of 3: {step === 1 ? 'Select Event Type' : step === 2 ? 'Event Details & Budget' : 'Preferences & Vibe'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-linear-to-r from-purple-600 to-indigo-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Generation Error</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Step 1: Event Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  What kind of event are you hosting?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEventTypeSelect('wedding')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      eventType === 'wedding'
                        ? 'border-purple-600 bg-purple-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                      <Heart className="w-5 h-5 fill-purple-600/30 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Wedding</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Sangeet, Vows, Reception</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEventTypeSelect('birthday')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      eventType === 'birthday'
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                      <Cake className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Birthday Party</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Kids, Milestones, Adult</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEventTypeSelect('community')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      eventType === 'community'
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Community Event</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Festivals, Melas, Galas</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Sub-type selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Select Event Style / Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {eventSubtypes[eventType].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSubType(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        subType === st || (!subType && st === eventSubtypes[eventType][0])
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    eventType === 'wedding'
                      ? 'e.g. Aarav & Maya’s Royal Wedding'
                      : eventType === 'birthday'
                      ? 'e.g. Vihaan’s 5th Superhero Birthday'
                      : 'e.g. Greenwood Society Diwali Mela'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Step 2: Date, Location, Guests, Budget */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Event Date</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>Location / City</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Udaipur, Mumbai, Bengaluru, Goa"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-800 font-medium"
                  />
                  {/* Quick City suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Udaipur', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Goa', 'Jaipur'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setLocation(city)}
                        className="text-[11px] bg-slate-100 hover:bg-purple-100 hover:text-purple-700 px-2 py-0.5 rounded-md text-slate-600 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Estimated Number of Guests</span>
                  </label>
                  <span className="text-sm font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {guestCount} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1500"
                  step="10"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>20 Intimate</span>
                  <span>250 Grand</span>
                  <span>750+ Mega</span>
                  <span>1,500 Extravaganza</span>
                </div>
              </div>

              {/* Budget in INR */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>Total Budget (in INR ₹)</span>
                  </label>
                  <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                    ₹{Number(budgetINR).toLocaleString('en-IN')}
                  </span>
                </div>

                <input
                  type="number"
                  min="10000"
                  step="50000"
                  value={budgetINR}
                  onChange={(e) => setBudgetINR(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-800"
                />

                {/* Quick budget chip presets */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {PRESET_BUDGETS.map((pb) => (
                    <button
                      key={pb.label}
                      type="button"
                      onClick={() => setBudgetINR(pb.value)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        budgetINR === pb.value
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {pb.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences, Notes & Vibe */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Select Event Preferences & Highlights
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {preferenceOptions[eventType].map((pref) => {
                    const isSelected = selectedPreferences.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => togglePreference(pref)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{pref}</span>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-purple-600 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Special Instructions or Cultural Nuances (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. We need a Jain food counter, a vintage car entry for groom, sunset pheras by 6:00 PM, and a dedicated kids play area..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm text-slate-800"
                />
              </div>

              {/* Summary Preview Banner */}
              <div className="bg-linear-to-r from-purple-50 via-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs text-slate-700 space-y-0.5">
                  <p className="font-bold text-slate-900">{title || 'Your Event'}</p>
                  <p className="text-slate-500">
                    {location} • {guestCount} Guests • ₹{Number(budgetINR).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-xs text-indigo-700 font-semibold bg-white/80 px-2.5 py-1 rounded-lg border border-indigo-200">
                  Ready for AI Synthesis
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Masterplan with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Complete Event Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
