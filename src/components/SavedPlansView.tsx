import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  FolderOpen, 
  PlusCircle, 
  Sparkles, 
  Heart, 
  Cake, 
  Search,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  Download,
  X,
  Loader2
} from 'lucide-react';
import { EventPlan, EventType } from '../types/event';
import { formatINR, formatCompactINR, formatDate } from '../utils/formatters';

interface SavedPlansViewProps {
  savedPlans: EventPlan[];
  activePlan: EventPlan | null;
  onOpenPlan: (plan: EventPlan) => void;
  onDuplicatePlan: (plan: EventPlan) => void;
  onDeletePlan: (id: string) => void;
  onSaveCurrentActivePlan: () => void;
  onOpenWizard: () => void;
  onSelectSample: (type: 'wedding' | 'birthday' | 'community') => void;
  onImportPlan?: (shareIdOrCode: string) => Promise<boolean>;
}

export const SavedPlansView: React.FC<SavedPlansViewProps> = ({
  savedPlans,
  activePlan,
  onOpenPlan,
  onDuplicatePlan,
  onDeletePlan,
  onSaveCurrentActivePlan,
  onOpenWizard,
  onSelectSample,
  onImportPlan,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImportSubmit = async () => {
    if (!importInput.trim()) return;
    if (!onImportPlan) return;
    setIsImporting(true);
    setImportError(null);
    try {
      const ok = await onImportPlan(importInput.trim());
      if (ok) {
        setIsImportModalOpen(false);
        setImportInput('');
      } else {
        setImportError('Could not find plan with this link or ID. Please check the code and try again.');
      }
    } catch {
      setImportError('Failed to import plan. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const isCurrentActiveSaved = activePlan 
    ? savedPlans.some((p) => p.id === activePlan.id) 
    : false;

  const filteredPlans = savedPlans.filter((plan) => {
    const matchesType = filterType === 'all' || plan.input.eventType === filterType;
    const matchesSearch = searchQuery.trim() === '' || 
      plan.input.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.input.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'wedding':
        return {
          icon: <Heart className="w-3.5 h-3.5 fill-purple-500/20 text-purple-600" />,
          label: 'Wedding',
          className: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      case 'birthday':
        return {
          icon: <Cake className="w-3.5 h-3.5 text-blue-600" />,
          label: 'Birthday',
          className: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'community':
        return {
          icon: <Users className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'Community',
          className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        };
      default:
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Event',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId === id) {
      onDeletePlan(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-linear-to-br from-white via-purple-50/40 to-indigo-50/50 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <BookmarkCheck className="w-4 h-4" />
            <span>My Plan Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Event Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Reopen, manage, duplicate, or customize your saved weddings, birthdays, and community gatherings. All plans and budget metrics persist automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {onImportPlan && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Import / Sync Plan</span>
            </button>
          )}

          {activePlan && !isCurrentActiveSaved && (
            <button
              onClick={onSaveCurrentActivePlan}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-200 shadow-xs transition-all cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Save Current Active Plan</span>
            </button>
          )}

          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {savedPlans.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Plans ({savedPlans.length})
            </button>
            <button
              onClick={() => setFilterType('wedding')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === 'wedding'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Weddings ({savedPlans.filter(p => p.input.eventType === 'wedding').length})
            </button>
            <button
              onClick={() => setFilterType('birthday')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === 'birthday'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Birthdays ({savedPlans.filter(p => p.input.eventType === 'birthday').length})
            </button>
            <button
              onClick={() => setFilterType('community')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === 'community'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Community ({savedPlans.filter(p => p.input.eventType === 'community').length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Saved Plans Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const badge = getEventBadge(plan.input.eventType);
            const totalBudget = Number(plan.input.budgetINR) || 0;
            const totalSpent = plan.budgetBreakdown.reduce(
              (acc, curr) => acc + (Number(curr.spentINR) || 0), 
              0
            );
            const remainingBalance = totalBudget - totalSpent;
            const completedTasks = plan.timeline.filter(t => t.isCompleted).length;
            const bookedVendors = plan.vendorChecklist.filter(v => v.status === 'Booked').length;
            const spentPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
            const isActive = activePlan?.id === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl relative overflow-hidden group ${
                  isActive 
                    ? 'border-purple-400 ring-2 ring-purple-500/20' 
                    : 'border-slate-200 hover:border-purple-200'
                }`}
              >
                {/* Active Plan Indicator Badge */}
                {isActive && (
                  <div className="absolute top-0 right-0 bg-linear-to-l from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Now</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${badge.className}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>

                    {plan.input.subType && (
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                        {plan.input.subType}
                      </span>
                    )}
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                      {plan.input.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate max-w-[120px]">{plan.input.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{formatDate(plan.input.date)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{plan.input.guestCount}</span>
                      </span>
                    </div>
                  </div>

                  {/* Budget & Spend Summary Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-500 font-semibold">Total Budget:</span>
                      <span className="text-sm font-black text-slate-900">{formatINR(totalBudget)}</span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-500 font-semibold">Tracked Spent:</span>
                      <span className="font-extrabold text-emerald-700">{formatINR(totalSpent)}</span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-500 font-semibold">Remaining:</span>
                      <span className={`font-extrabold ${remainingBalance >= 0 ? 'text-indigo-900' : 'text-rose-600'}`}>
                        {formatINR(remainingBalance)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${spentPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>{spentPercentage}% Spent</span>
                        <span>{plan.budgetBreakdown.length} Categories</span>
                      </div>
                    </div>
                  </div>

                  {/* Milestone & Vendor counters */}
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{completedTasks} of {plan.timeline.length} Milestones</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{bookedVendors} of {plan.vendorChecklist.length} Vendors</span>
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => onOpenPlan(plan)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open Plan</span>
                  </button>

                  <button
                    onClick={() => onDuplicatePlan(plan)}
                    title="Duplicate this plan"
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => confirmDelete(plan.id, e)}
                    title={deletingId === plan.id ? 'Click again to confirm delete' : 'Delete plan'}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      deletingId === plan.id
                        ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                        : 'border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
            <BookmarkCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {searchQuery ? 'No matching saved plans found' : 'No Saved Plans in Your Library'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery 
                ? `No plans matched "${searchQuery}". Clear your search query or reset category filters.`
                : 'Save your active event plan to keep track of multiple celebrations, or generate a custom masterplan using AI.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onImportPlan && (
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-purple-600" />
                <span>Import / Sync Plan</span>
              </button>
            )}

            {activePlan && !isCurrentActiveSaved && (
              <button
                onClick={onSaveCurrentActivePlan}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>Save Current Active Plan</span>
              </button>
            )}

            <button
              onClick={onOpenWizard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Plan</span>
            </button>
          </div>

          {/* Quick Showcase Samples row */}
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or Explore Pre-loaded Showcase Plans:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onSelectSample('birthday')}
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                🎂 1st Birthday Party (₹50K)
              </button>
              <button
                onClick={() => onSelectSample('wedding')}
                className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors cursor-pointer"
              >
                💍 Royal Wedding (₹35L)
              </button>
              <button
                onClick={() => onSelectSample('community')}
                className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
              >
                👥 Community Mela (₹8L)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import / Sync Plan Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Import or Sync Plan</h3>
                  <p className="text-xs text-slate-500">Restore your plan across links, devices, or tabs</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportError(null);
                  setImportInput('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Share Link, Plan ID, or Sync Code
              </label>
              <input
                type="text"
                value={importInput}
                onChange={(e) => {
                  setImportInput(e.target.value);
                  setImportError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleImportSubmit();
                }}
                placeholder="Paste shared link or ID (e.g. plan-birthday-test-nellore)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                Paste any EventEase share link or a plan ID to synchronize your event plan.
              </p>
            </div>

            {importError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportError(null);
                  setImportInput('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!importInput.trim() || isImporting}
                onClick={handleImportSubmit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Import Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
