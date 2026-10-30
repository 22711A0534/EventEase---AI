import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  Share2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  PieChart, 
  ShieldCheck, 
  Palette, 
  MessageSquare,
  Wand2,
  ChevronRight,
  ArrowLeft,
  Check,
  Bookmark,
  BookmarkCheck,
  Download,
  Loader2
} from 'lucide-react';
import { EventPlan } from '../types/event';
import { formatINR, formatCompactINR, formatDate, getCountdown } from '../utils/formatters';
import { exportPlanToPDF } from '../utils/pdfExport';
import { createShareableLink } from '../utils/shareUtils';
import { BudgetPlanner } from './BudgetPlanner';
import { TimelineView } from './TimelineView';
import { VendorChecklist } from './VendorChecklist';
import { PersonalizedIdeas } from './PersonalizedIdeas';
import { AIChatAssistant } from './AIChatAssistant';

interface PlanDashboardProps {
  plan: EventPlan;
  onUpdatePlan: (plan: EventPlan) => void;
  onOpenWizard: () => void;
  onBackToHome: () => void;
  onSavePlan?: () => void;
  isSaved?: boolean;
}

export const PlanDashboard: React.FC<PlanDashboardProps> = ({
  plan,
  onUpdatePlan,
  onOpenWizard,
  onBackToHome,
  onSavePlan,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'vendors' | 'ideas' | 'chat'>('budget');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const countdown = getCountdown(plan.input.date);

  const handleExportPDF = () => {
    try {
      setIsExportingPDF(true);
      exportPlanToPDF(plan);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setTimeout(() => setIsExportingPDF(false), 800);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareUrl = await createShareableLink(plan);
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setShareToast('Direct share link copied to clipboard!');
      setTimeout(() => {
        setCopiedShare(false);
        setShareToast(null);
      }, 3500);
    } catch (e) {
      console.error('Failed to copy share link', e);
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      } catch (clipErr) {
        console.error('Clipboard error:', clipErr);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Share Toast Banner */}
      {shareToast && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{shareToast} (Paste into any browser tab to open this exact plan)</span>
          </div>
          <button 
            onClick={() => setShareToast(null)} 
            className="text-white hover:text-emerald-200 text-sm font-black px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto relative z-10">
          {onSavePlan && (
            <button
              onClick={onSavePlan}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                isSaved
                  ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Saved to Library</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                  <span>Save Plan</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleShare}
            disabled={isSharing}
            title="Generate shareable link for this exact event plan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                <span>Generating Link...</span>
              </>
            ) : copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            title="Download complete plan as formatted PDF"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/80 hover:bg-purple-100 text-purple-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            {isExportingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-purple-700" />
                <span>Export PDF</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Plan Another Event</span>
          </button>
        </div>
      </div>

      {/* Hero Master Summary Card */}
      <div className="bg-linear-to-br from-white via-purple-50/40 to-indigo-50/50 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200/30 rounded-bl-full blur-2xl pointer-events-none" />

        <div className="relative space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-purple-600 text-white shadow-2xs">
                  {plan.input.eventType.toUpperCase()}
                </span>
                {plan.input.subType && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-800">
                    {plan.input.subType}
                  </span>
                )}
                <span className="text-xs font-medium text-slate-400">
                  Synthesized on {formatDate(plan.createdAt)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {plan.input.title}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                {plan.executiveSummary}
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="shrink-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-purple-200 shadow-sm text-center min-w-[170px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                Event Countdown
              </span>
              {countdown.isPast ? (
                <div className="text-base font-bold text-slate-700">Event Concluded</div>
              ) : (
                <div className="space-y-0.5">
                  <div className="text-3xl font-black text-purple-700">
                    {countdown.days} <span className="text-xs font-bold text-slate-500">Days</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    & {countdown.hours} Hours Remaining
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-purple-100/80">
            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Budget</p>
                <p className="text-sm font-extrabold text-slate-900">{formatINR(plan.input.budgetINR)}</p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Guests</p>
                <p className="text-sm font-extrabold text-slate-900">{plan.input.guestCount} People</p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Date</p>
                <p className="text-sm font-extrabold text-slate-900">{formatDate(plan.input.date)}</p>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Location</p>
                <p className="text-sm font-extrabold text-slate-900 truncate max-w-[120px]">{plan.input.location}</p>
              </div>
            </div>
          </div>

          {/* AI Smart Insider Recommendations Banner */}
          {plan.smartRecommendations && plan.smartRecommendations.length > 0 && (
            <div className="bg-purple-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3 shadow-md">
              <div className="p-2 rounded-xl bg-purple-800 text-amber-300 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-extrabold uppercase tracking-wider text-purple-200">
                  AI Event Director’s Top Strategic Tips for {plan.input.location}:
                </p>
                <ul className="space-y-1 text-purple-100">
                  {plan.smartRecommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-amber-300 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="border-b border-slate-200 no-print">
        <div className="flex items-center gap-2 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('budget')}
            className={`py-3.5 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'budget'
                ? 'border-purple-600 text-purple-700 bg-purple-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>AI Budget Planner</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {formatCompactINR(plan.input.budgetINR)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3.5 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-purple-600 text-purple-700 bg-purple-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>AI Event Timeline</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {plan.timeline.length} Milestones
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`py-3.5 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'vendors'
                ? 'border-purple-600 text-purple-700 bg-purple-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Vendor Checklist</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {plan.vendorChecklist.length} Categories
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className={`py-3.5 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ideas'
                ? 'border-purple-600 text-purple-700 bg-purple-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Palette className="w-4 h-4 text-pink-600" />
            <span>Personalized Ideas</span>
            <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">
              Themes • Menus • Invites
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3.5 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'border-purple-600 text-purple-700 bg-purple-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Tab Content Components (Interactive Screen Only) */}
      <div className="pt-2 print:hidden">
        {activeTab === 'budget' && (
          <BudgetPlanner plan={plan} onUpdatePlan={onUpdatePlan} />
        )}

        {activeTab === 'timeline' && (
          <TimelineView plan={plan} onUpdatePlan={onUpdatePlan} />
        )}

        {activeTab === 'vendors' && (
          <VendorChecklist plan={plan} onUpdatePlan={onUpdatePlan} />
        )}

        {activeTab === 'ideas' && (
          <PersonalizedIdeas plan={plan} />
        )}

        {activeTab === 'chat' && (
          <AIChatAssistant currentPlan={plan} />
        )}
      </div>

      {/* Comprehensive Print-Only Document Layout (Captured during Print Preview) */}
      <div className="hidden print:block space-y-8 pt-4">
        {/* Print Master Plan Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex justify-between items-baseline">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700">EventEase AI • Official Event Masterplan</p>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{plan.input.title}</h1>
            </div>
            <div className="text-right text-xs text-slate-500 font-medium">
              <p>{formatDate(plan.input.date)}</p>
              <p>{plan.input.location} • {plan.input.guestCount} Guests</p>
            </div>
          </div>
        </div>

        {/* Financial KPI Summary Box */}
        {(() => {
          const totalBudget = Number(plan.input.budgetINR) || 0;
          const totalSpent = plan.budgetBreakdown.reduce(
            (acc, curr) => acc + (Number(curr.spentINR) || 0),
            0
          );
          const remaining = totalBudget - totalSpent;
          return (
            <div className="grid grid-cols-3 gap-4 border border-slate-300 rounded-xl p-4 bg-slate-50 print-avoid-break">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Total Event Budget</p>
                <p className="text-base font-extrabold text-slate-900">{formatINR(totalBudget)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Tracked Spent / Booked</p>
                <p className="text-base font-extrabold text-emerald-700">{formatINR(totalSpent)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Remaining Balance</p>
                <p className={`text-base font-extrabold ${remaining >= 0 ? 'text-purple-900' : 'text-rose-600'}`}>
                  {formatINR(remaining)}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Section 1: Complete Budget Breakdown */}
        <div className="space-y-3 print-avoid-break">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. AI Budget Breakdown & Expense Tracking
          </h2>
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <th className="p-2 border border-slate-300">Category</th>
                <th className="p-2 border border-slate-300">Allocated (INR)</th>
                <th className="p-2 border border-slate-300">Actual Spent</th>
                <th className="p-2 border border-slate-300">Remaining</th>
                <th className="p-2 border border-slate-300">Priority</th>
                <th className="p-2 border border-slate-300">Cost-Saving Tip</th>
              </tr>
            </thead>
            <tbody>
              {plan.budgetBreakdown.map((item) => {
                const allocated = Number(item.allocatedINR) || 0;
                const spent = Number(item.spentINR) || 0;
                const diff = allocated - spent;
                return (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="p-2 font-medium border border-slate-300">{item.category}</td>
                    <td className="p-2 font-semibold border border-slate-300">{formatINR(allocated)}</td>
                    <td className="p-2 font-semibold border border-slate-300 text-emerald-800">{formatINR(spent)}</td>
                    <td className={`p-2 font-semibold border border-slate-300 ${diff >= 0 ? 'text-slate-700' : 'text-rose-700'}`}>
                      {diff < 0 ? `-${formatINR(Math.abs(diff))}` : formatINR(diff)}
                    </td>
                    <td className="p-2 border border-slate-300">{item.priority}</td>
                    <td className="p-2 text-[10px] text-slate-600 border border-slate-300">{item.moneySavingTip || 'Compare quotes'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 2: Preparation Timeline */}
        {plan.timeline && plan.timeline.length > 0 && (
          <div className="space-y-3 print-avoid-break">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Preparation Timeline & Milestones
            </h2>
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                  <th className="p-2 border border-slate-300">Phase</th>
                  <th className="p-2 border border-slate-300">Milestone Task</th>
                  <th className="p-2 border border-slate-300">Deadline Target</th>
                  <th className="p-2 border border-slate-300">Category</th>
                  <th className="p-2 border border-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {plan.timeline.map((task) => (
                  <tr key={task.id} className="border-b border-slate-200">
                    <td className="p-2 font-semibold border border-slate-300">{task.phase}</td>
                    <td className="p-2 font-medium border border-slate-300">{task.title}</td>
                    <td className="p-2 text-slate-600 border border-slate-300">{task.deadlineOffset || 'Prior to event'}</td>
                    <td className="p-2 border border-slate-300">{task.category}</td>
                    <td className="p-2 border border-slate-300 font-bold">{task.isCompleted ? '✓ Completed' : 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 3: Vendor Checklist */}
        {plan.vendorChecklist && plan.vendorChecklist.length > 0 && (
          <div className="space-y-3 print-avoid-break">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              3. Vendor Coordination & Deliverables Checklist
            </h2>
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                  <th className="p-2 border border-slate-300">Vendor Type</th>
                  <th className="p-2 border border-slate-300">Estimated Cost</th>
                  <th className="p-2 border border-slate-300">Booking Status</th>
                  <th className="p-2 border border-slate-300">Importance</th>
                  <th className="p-2 border border-slate-300">Deliverables Checklist</th>
                </tr>
              </thead>
              <tbody>
                {plan.vendorChecklist.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-slate-200">
                    <td className="p-2 font-medium border border-slate-300">{vendor.category}</td>
                    <td className="p-2 font-semibold border border-slate-300">{vendor.estimatedCostINR}</td>
                    <td className="p-2 border border-slate-300 font-bold">{vendor.status}</td>
                    <td className="p-2 border border-slate-300">{vendor.importance}</td>
                    <td className="p-2 text-[10px] text-slate-600 border border-slate-300">
                      {vendor.deliverablesChecklist ? vendor.deliverablesChecklist.slice(0, 2).join('; ') : 'Scope review'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 4: Creative Themes & Menu Highlights */}
        {plan.creativeIdeas && (
          <div className="space-y-3 print-avoid-break">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              4. Creative Concepts, Themes & Catering Highlights
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {plan.creativeIdeas.themes && plan.creativeIdeas.themes.length > 0 && (
                <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
                  <p className="font-bold text-purple-800 uppercase mb-1">
                    Theme: {plan.creativeIdeas.themes[0].name}
                  </p>
                  <p className="text-[11px] text-slate-600 mb-2 italic">
                    "{plan.creativeIdeas.themes[0].tagline}"
                  </p>
                  <p className="text-[10px] text-slate-700">
                    {plan.creativeIdeas.themes[0].description}
                  </p>
                </div>
              )}
              {plan.creativeIdeas.foodAndBeverage && (
                <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase mb-1">Curated Menu Highlights</p>
                  <p className="text-[10px] text-slate-700">
                    <span className="font-bold">Drinks:</span> {(plan.creativeIdeas.foodAndBeverage.welcomeDrinks || []).join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-700 mt-1">
                    <span className="font-bold">Appetizers:</span> {(plan.creativeIdeas.foodAndBeverage.appetizers || []).join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-700 mt-1">
                    <span className="font-bold">Mains:</span> {(plan.creativeIdeas.foodAndBeverage.mainCourseHighlights || []).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-3">
          Plan generated & synchronized via EventEase AI • All rights reserved
        </div>
      </div>
    </div>
  );
};
