/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  PlusCircle, 
  Heart, 
  Cake, 
  Users, 
  Calendar,
  CheckCircle2,
  Bot,
  Loader2
} from 'lucide-react';
import { EventPlan, EventType } from './types/event';
import { 
  SAMPLE_WEDDING_PLAN, 
  SAMPLE_BIRTHDAY_PLAN, 
  SAMPLE_COMMUNITY_PLAN 
} from './data/samplePlans';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { EventWizardModal } from './components/EventWizardModal';
import { PlanDashboard } from './components/PlanDashboard';
import { AIChatAssistant } from './components/AIChatAssistant';
import { SavedPlansView } from './components/SavedPlansView';
import { triggerConfetti } from './utils/formatters';
import { retrieveSharedPlan, decodePlanFromBase64 } from './utils/shareUtils';

const STORAGE_KEY = 'eventease_active_plan';
const SAVED_PLANS_KEY = 'eventease_saved_plans';
const LAST_ACTIVE_ID_KEY = 'eventease_last_active_plan_id';
const ACTIVE_TAB_KEY = 'eventease_active_tab';

const SAMPLE_PLAN_IDS = new Set([
  'sample-wedding-royal',
  'sample-birthday-wonderland',
  'sample-community-fest',
]);

function isSamplePlan(plan: EventPlan | null | undefined): boolean {
  if (!plan) return false;
  if (typeof plan.id === 'string') {
    if (SAMPLE_PLAN_IDS.has(plan.id) || plan.id.startsWith('sample-')) {
      return true;
    }
  }
  const title = (plan.input?.title || '').toLowerCase();
  if ((title.includes('aanya') || title.includes('ananya')) && title.includes('birthday')) return true;
  if (title.includes('aarav') && title.includes('maya')) return true;
  if (title.includes('greenwood heights')) return true;
  return false;
}

function getInitialSavedPlans(): EventPlan[] {
  try {
    const raw = localStorage.getItem(SAVED_PLANS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((p) => p && p.id && p.input && Array.isArray(p.budgetBreakdown) && !isSamplePlan(p));
      }
    }
  } catch (e) {
    console.error('Failed to load saved plans from localStorage', e);
  }
  return [];
}

function getInitialPlan(savedPlans: EventPlan[]): EventPlan | null {
  // Check for immediate base64 payload in hash if opened directly via shared link
  if (typeof window !== 'undefined') {
    const hash = window.location.hash || '';
    if (hash.includes('plan_data=')) {
      const encoded = hash.split('plan_data=')[1];
      if (encoded) {
        const decoded = decodePlanFromBase64(encoded);
        if (decoded && decoded.input) return decoded;
      }
    }
  }

  // 1. If user has saved plans: ALWAYS prioritize user's saved plans over sample plans
  const userSavedPlans = savedPlans.filter((p) => !isSamplePlan(p));
  if (userSavedPlans.length > 0) {
    // Check if the user previously had a recorded last active plan ID
    try {
      const lastActiveId = localStorage.getItem(LAST_ACTIVE_ID_KEY);
      if (lastActiveId) {
        const matched = userSavedPlans.find((p) => p.id === lastActiveId);
        if (matched) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
          } catch {}
          return matched;
        }
      }
    } catch {}

    // Check localStorage active plan
    try {
      const rawActive = localStorage.getItem(STORAGE_KEY);
      if (rawActive) {
        const parsed = JSON.parse(rawActive);
        if (parsed && parsed.input && Array.isArray(parsed.budgetBreakdown)) {
          if (!isSamplePlan(parsed)) {
            const inSaved = userSavedPlans.find((p) => p.id === parsed.id);
            return inSaved || parsed;
          } else {
            // Remove cached sample plan from active plan storage
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse active plan from localStorage', e);
    }

    // Default to the user's most recent saved plan (e.g., Birthday Celebration – EventEase AI Test)
    const defaultSaved = userSavedPlans[0];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSaved));
      localStorage.setItem(LAST_ACTIVE_ID_KEY, defaultSaved.id);
    } catch {}
    return defaultSaved;
  }

  // 2. If NO saved plans exist:
  // Check if there is an unsaved user draft in localStorage (that is NOT a sample plan)
  try {
    const rawActive = localStorage.getItem(STORAGE_KEY);
    if (rawActive) {
      const parsed = JSON.parse(rawActive);
      if (parsed && parsed.input && Array.isArray(parsed.budgetBreakdown)) {
        if (!isSamplePlan(parsed)) {
          return parsed;
        } else {
          // Clean up stale sample plan from active plan storage so it never displays
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse draft plan from localStorage', e);
  }

  // 3. No user plans exist: return null so Home page / empty state is shown,
  // NEVER automatically loading a sample plan.
  return null;
}

function getInitialActiveTab(): 'home' | 'dashboard' | 'chat' | 'saved' {
  if (typeof window !== 'undefined') {
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    if (search.includes('share=') || hash.includes('plan_data=')) {
      return 'dashboard';
    }
    try {
      const savedTab = sessionStorage.getItem(ACTIVE_TAB_KEY);
      if (savedTab === 'dashboard' || savedTab === 'saved' || savedTab === 'chat' || savedTab === 'home') {
        return savedTab;
      }
    } catch {}
  }
  return 'home';
}

export default function App() {
  const [savedPlans, setSavedPlans] = useState<EventPlan[]>(getInitialSavedPlans);
  const [currentPlan, setCurrentPlan] = useState<EventPlan | null>(() => getInitialPlan(getInitialSavedPlans()));
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'chat' | 'saved'>(getInitialActiveTab);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardInitialType, setWizardInitialType] = useState<EventType>('wedding');
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [sharedPlanLoading, setSharedPlanLoading] = useState<boolean>(false);
  const [sharedPlanNotification, setSharedPlanNotification] = useState<string | null>(null);

  const handleTabChange = (tab: 'home' | 'dashboard' | 'chat' | 'saved') => {
    setActiveTab(tab);
    try {
      sessionStorage.setItem(ACTIVE_TAB_KEY, tab);
    } catch {}
  };

  useEffect(() => {
    const loadSharedPlan = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const shareId = searchParams.get('share');
        const hash = window.location.hash;

        let planToLoad: EventPlan | null = null;

        if (shareId) {
          setSharedPlanLoading(true);
          planToLoad = await retrieveSharedPlan(shareId);
        } else if (hash && hash.includes('plan_data=')) {
          const encoded = hash.split('plan_data=')[1];
          if (encoded) {
            planToLoad = decodePlanFromBase64(encoded);
          }
        }

        if (planToLoad && planToLoad.input) {
          setCurrentPlan(planToLoad);
          savePlanToStorage(planToLoad);
          try {
            localStorage.setItem(LAST_ACTIVE_ID_KEY, planToLoad.id);
          } catch {}

          // Automatically sync into savedPlans so it persists permanently across reloads and tabs
          setSavedPlans((prevPlans) => {
            const exists = prevPlans.some((p) => p.id === planToLoad!.id);
            const updated = exists
              ? prevPlans.map((p) => (p.id === planToLoad!.id ? planToLoad! : p))
              : [planToLoad!, ...prevPlans];
            try {
              localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });

          handleTabChange('dashboard');
          setSharedPlanNotification(`Loaded shared plan: "${planToLoad.input.title}"`);
          triggerConfetti();

          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch {
            // Safe ignore in restricted browser environments
          }

          setTimeout(() => {
            setSharedPlanNotification(null);
          }, 6000);
        }
      } catch (err) {
        console.error('Error loading shared plan:', err);
      } finally {
        setSharedPlanLoading(false);
      }
    };

    // Sync persistent saved plans from server on startup
    const syncServerPlans = async () => {
      try {
        const response = await fetch('/api/saved-plans');
        if (response.ok) {
          const serverPlans: EventPlan[] = await response.json();
          if (Array.isArray(serverPlans) && serverPlans.length > 0) {
            const validServerPlans = serverPlans.filter(
              (p) => p && p.id && p.input && !isSamplePlan(p)
            );
            if (validServerPlans.length > 0) {
              setSavedPlans((localSaved) => {
                const seenIds = new Set(localSaved.map((p) => p.id));
                const merged = [...localSaved];
                for (const sp of validServerPlans) {
                  if (!seenIds.has(sp.id)) {
                    merged.push(sp);
                    seenIds.add(sp.id);
                  }
                }
                try {
                  localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(merged));
                } catch {}

                // If no active plan is loaded or active plan was a sample plan, set to user's saved plan
                setCurrentPlan((prevCurrent) => {
                  if (!prevCurrent || isSamplePlan(prevCurrent)) {
                    const primary = merged[0];
                    savePlanToStorage(primary);
                    try {
                      localStorage.setItem(LAST_ACTIVE_ID_KEY, primary.id);
                    } catch {}
                    return primary;
                  }
                  return prevCurrent;
                });

                return merged;
              });
            }
          }
        }
      } catch (err) {
        console.warn('Could not sync saved plans from server:', err);
      }
    };

    loadSharedPlan();
    syncServerPlans();
  }, []);

  const handlePlanImportedSuccess = (imported: EventPlan) => {
    setCurrentPlan(imported);
    savePlanToStorage(imported);
    try {
      localStorage.setItem(LAST_ACTIVE_ID_KEY, imported.id);
    } catch {}

    setSavedPlans((prev) => {
      const exists = prev.some((p) => p.id === imported.id);
      const updated = exists
        ? prev.map((p) => (p.id === imported.id ? imported : p))
        : [imported, ...prev];
      try {
        localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    handleTabChange('dashboard');
    setSharedPlanNotification(`Imported plan: "${imported.input.title}"`);
    triggerConfetti();
  };

  const handleImportPlan = async (shareIdOrCode: string): Promise<boolean> => {
    try {
      let code = shareIdOrCode.trim();
      if (!code) return false;

      // If full URL was pasted, extract share query param or hash
      if (code.includes('share=')) {
        try {
          const url = new URL(code, window.location.origin);
          code = url.searchParams.get('share') || code;
        } catch {
          const match = code.match(/share=([^&#]+)/);
          if (match && match[1]) code = decodeURIComponent(match[1]);
        }
      } else if (code.includes('plan_data=')) {
        const hashPart = code.split('plan_data=')[1];
        if (hashPart) {
          const decoded = decodePlanFromBase64(hashPart);
          if (decoded && decoded.input) {
            handlePlanImportedSuccess(decoded);
            return true;
          }
        }
      }

      // Try decoding base64 directly
      const directDecoded = decodePlanFromBase64(code);
      if (directDecoded && directDecoded.input) {
        handlePlanImportedSuccess(directDecoded);
        return true;
      }

      // Try fetching from server by shareId or plan ID
      const fetched = await retrieveSharedPlan(code);
      if (fetched && fetched.input) {
        handlePlanImportedSuccess(fetched);
        return true;
      }
    } catch (e) {
      console.error('Failed to import plan', e);
    }
    return false;
  };

  const savePlanToStorage = (planToSave: EventPlan | null) => {
    try {
      if (planToSave) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(planToSave));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save plan to localStorage', e);
    }
  };

  const persistSavedPlans = (plans: EventPlan[]) => {
    try {
      localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(plans));
      setSavedPlans(plans);
    } catch (e) {
      console.error('Failed to save saved plans to localStorage', e);
    }

    // Persist non-sample user plans to server
    plans.forEach((p) => {
      if (!isSamplePlan(p)) {
        fetch('/api/saved-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
        }).catch((err) => console.warn('Server sync error:', err));
      }
    });
  };

  const handleStartPlanning = (eventType?: EventType) => {
    if (eventType) {
      setWizardInitialType(eventType);
    }
    setIsWizardOpen(true);
  };

  const handleSelectSample = (type: 'wedding' | 'birthday' | 'community') => {
    let selected: EventPlan = SAMPLE_BIRTHDAY_PLAN;
    if (type === 'wedding') {
      selected = SAMPLE_WEDDING_PLAN;
    } else if (type === 'birthday') {
      selected = SAMPLE_BIRTHDAY_PLAN;
    } else {
      selected = SAMPLE_COMMUNITY_PLAN;
    }
    setCurrentPlan(selected);
    savePlanToStorage(selected);
    try {
      localStorage.setItem(LAST_ACTIVE_ID_KEY, selected.id);
    } catch {}
    handleTabChange('dashboard');
    triggerConfetti();
  };

  const handlePlanCreated = (newPlan: EventPlan) => {
    setCurrentPlan(newPlan);
    savePlanToStorage(newPlan);
    try {
      localStorage.setItem(LAST_ACTIVE_ID_KEY, newPlan.id);
    } catch {}
    const updated = [newPlan, ...savedPlans.filter((p) => p.id !== newPlan.id)];
    persistSavedPlans(updated);
    handleTabChange('dashboard');
    triggerConfetti();
  };

  const handleUpdatePlan = (updatedPlan: EventPlan) => {
    setCurrentPlan(updatedPlan);
    savePlanToStorage(updatedPlan);
    // If this plan is also in savedPlans, keep the saved library in sync
    if (savedPlans.some((p) => p.id === updatedPlan.id)) {
      const updatedList = savedPlans.map((p) =>
        p.id === updatedPlan.id
          ? { ...updatedPlan, lastSavedAt: new Date().toISOString() }
          : p
      );
      persistSavedPlans(updatedList);
    }
  };

  const handleSavePlan = () => {
    if (!currentPlan) return;
    const planToSave: EventPlan = {
      ...currentPlan,
      lastSavedAt: new Date().toISOString(),
    };

    const existingIndex = savedPlans.findIndex((p) => p.id === planToSave.id);
    let updatedList: EventPlan[];
    if (existingIndex >= 0) {
      updatedList = [...savedPlans];
      updatedList[existingIndex] = planToSave;
    } else {
      updatedList = [planToSave, ...savedPlans];
    }

    persistSavedPlans(updatedList);
    setCurrentPlan(planToSave);
    savePlanToStorage(planToSave);
    try {
      localStorage.setItem(LAST_ACTIVE_ID_KEY, planToSave.id);
    } catch {}
    triggerConfetti();
  };

  const handleOpenSavedPlan = (plan: EventPlan) => {
    setCurrentPlan(plan);
    savePlanToStorage(plan);
    try {
      localStorage.setItem(LAST_ACTIVE_ID_KEY, plan.id);
    } catch {}
    handleTabChange('dashboard');
    triggerConfetti();
  };

  const handleDuplicateSavedPlan = (plan: EventPlan) => {
    const timestamp = Date.now();
    const duplicatedPlan: EventPlan = {
      ...plan,
      id: `plan-${timestamp}`,
      createdAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
      input: {
        ...plan.input,
        title: `${plan.input.title} (Copy)`,
      },
    };
    const updatedList = [duplicatedPlan, ...savedPlans];
    persistSavedPlans(updatedList);
    triggerConfetti();
  };

  const handleDeleteSavedPlan = (id: string) => {
    const updatedList = savedPlans.filter((p) => p.id !== id);
    persistSavedPlans(updatedList);
    fetch(`/api/saved-plans/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});

    // If the active plan was deleted, select the first remaining saved plan, or null if none
    if (currentPlan?.id === id) {
      if (updatedList.length > 0) {
        const nextPlan = updatedList[0];
        setCurrentPlan(nextPlan);
        savePlanToStorage(nextPlan);
        try {
          localStorage.setItem(LAST_ACTIVE_ID_KEY, nextPlan.id);
        } catch {}
      } else {
        setCurrentPlan(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(LAST_ACTIVE_ID_KEY);
        } catch {}
        handleTabChange('home');
      }
    }
  };

  const isCurrentPlanSaved = currentPlan 
    ? savedPlans.some((p) => p.id === currentPlan.id) 
    : false;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        openWizard={() => handleStartPlanning()}
        currentPlan={currentPlan}
        onSelectSample={handleSelectSample}
        savedCount={savedPlans.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Shared Plan Loaded Toast Banner */}
        {sharedPlanNotification && (
          <div className="mb-6 bg-linear-to-r from-purple-700 via-indigo-700 to-blue-700 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-bold no-print animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{sharedPlanNotification}</span>
            </div>
            <button
              onClick={() => setSharedPlanNotification(null)}
              className="text-white hover:text-amber-200 text-sm font-black px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State when fetching shared plan */}
        {sharedPlanLoading && (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Retrieving shared event plan...</p>
            <p className="text-xs text-slate-400">Loading accurate budget breakdown, timeline & vendor checklists</p>
          </div>
        )}

        {activeTab === 'home' && !sharedPlanLoading && (
          <HeroLanding
            onStartPlanning={handleStartPlanning}
            onSelectSample={handleSelectSample}
            openChat={() => handleTabChange('chat')}
          />
        )}

        {activeTab === 'dashboard' && (
          currentPlan ? (
            <PlanDashboard
              plan={currentPlan}
              onUpdatePlan={handleUpdatePlan}
              onOpenWizard={() => handleStartPlanning(currentPlan.input.eventType)}
              onBackToHome={() => handleTabChange('home')}
              onSavePlan={handleSavePlan}
              isSaved={isCurrentPlanSaved}
            />
          ) : (
            <div className="py-16 max-w-xl mx-auto text-center space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">No Active Event Plan</h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  You don't have an active event plan selected. You can create a new personalized event plan with AI or explore our sample plans from the menu.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleStartPlanning()}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Plan</span>
                </button>
                <button
                  onClick={() => handleTabChange('saved')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm border border-purple-200 transition-all cursor-pointer"
                >
                  Go to Saved Plans / Import
                </button>
                <button
                  onClick={() => handleTabChange('home')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'saved' && (
          <SavedPlansView
            savedPlans={savedPlans}
            activePlan={currentPlan}
            onOpenPlan={handleOpenSavedPlan}
            onDuplicatePlan={handleDuplicateSavedPlan}
            onDeletePlan={handleDeleteSavedPlan}
            onSaveCurrentActivePlan={handleSavePlan}
            onOpenWizard={() => handleStartPlanning()}
            onSelectSample={handleSelectSample}
            onImportPlan={handleImportPlan}
          />
        )}

        {activeTab === 'chat' && (
          <div className="py-6 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
              <h2 className="text-2xl font-black text-slate-900">
                Interactive AI Event Assistant
              </h2>
              <p className="text-xs text-slate-500">
                Grounded in Indian cultural traditions, realistic INR budgeting, vendor contracts, and countdown timelines.
              </p>
            </div>
            <AIChatAssistant currentPlan={currentPlan} />
          </div>
        )}
      </main>

      {/* Floating AI Chat Drawer Trigger (Always accessible on bottom-right) */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        {isFloatingChatOpen ? (
          <div className="relative shadow-2xl rounded-3xl animate-in fade-in slide-in-from-bottom-5">
            <AIChatAssistant
              currentPlan={currentPlan}
              isFloating={true}
              onCloseFloating={() => setIsFloatingChatOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsFloatingChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-amber-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-purple-600 animate-ping" />
            </div>
            <span>Ask EventEase AI</span>
          </button>
        )}
      </div>

      {/* Event Planner Wizard Modal */}
      <EventWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onPlanCreated={handlePlanCreated}
        initialEventType={wizardInitialType}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">EventEase AI</p>
              <p className="text-[11px] text-slate-500">Plan Smarter. Celebrate Better. Make Every Event Memorable.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
            <button onClick={() => handleTabChange('saved')} className="hover:text-purple-600 transition-colors cursor-pointer">
              Saved Plans ({savedPlans.length})
            </button>
            <button onClick={() => handleSelectSample('wedding')} className="hover:text-purple-600 transition-colors cursor-pointer">
              Royal Wedding Plan
            </button>
            <button onClick={() => handleSelectSample('birthday')} className="hover:text-blue-600 transition-colors cursor-pointer">
              1st Birthday Plan
            </button>
            <button onClick={() => handleSelectSample('community')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Community Mela Plan
            </button>
            <button onClick={() => handleStartPlanning()} className="text-purple-600 font-bold hover:underline cursor-pointer">
              Create New Plan (+)
            </button>
          </div>

          <p className="text-slate-400 text-center md:text-right">
            © {new Date().getFullYear()} EventEase AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
