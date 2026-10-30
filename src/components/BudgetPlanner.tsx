import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingDown, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Lightbulb, 
  ShieldAlert, 
  PieChart, 
  DollarSign, 
  Sparkles,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { BudgetItem, EventPlan } from '../types/event';
import { formatINR, formatCompactINR } from '../utils/formatters';

interface BudgetPlannerProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  plan,
  onUpdatePlan,
}) => {
  // Single consistent source of truth: directly derived from plan.budgetBreakdown
  const items = plan.budgetBreakdown;

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newAmount, setNewAmount] = useState<number>(50000);
  const [newPriority, setNewPriority] = useState<'Must-Have' | 'Recommended' | 'Optional'>('Recommended');
  const [newTip, setNewTip] = useState<string>('');

  // Robust calculations using single source of truth
  const totalBudget = Number(plan.input.budgetINR) || 0;
  const totalAllocated = items.reduce((acc, curr) => acc + (Number(curr.allocatedINR) || 0), 0);
  const totalSpent = items.reduce((acc, curr) => acc + (Number(curr.spentINR) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const bufferVariance = totalBudget - totalAllocated;
  const isOverallOverBudget = totalSpent > totalBudget;

  const handleToggleBooked = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const isBooked = !item.isBooked;
        return {
          ...item,
          isBooked,
          spentINR: isBooked && (!item.spentINR || item.spentINR === 0) ? item.allocatedINR : (item.spentINR || 0)
        };
      }
      return item;
    });
    onUpdatePlan({ ...plan, budgetBreakdown: updated });
  };

  const handleUpdateSpent = (id: string, rawVal: string) => {
    // When input is cleared, default to 0
    if (rawVal.trim() === '') {
      commitSpentUpdate(id, 0);
      return;
    }

    const parsed = parseFloat(rawVal);
    // Prevent negative, invalid, or NaN expense values
    if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
      return;
    }

    commitSpentUpdate(id, parsed);
  };

  const commitSpentUpdate = (id: string, amount: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { 
          ...item, 
          spentINR: amount, 
          isBooked: amount > 0 ? true : item.isBooked 
        };
      }
      return item;
    });
    onUpdatePlan({ ...plan, budgetBreakdown: updated });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || newAmount <= 0) return;

    const newItem: BudgetItem = {
      id: 'b-custom-' + Date.now(),
      category: newCategory.trim(),
      allocatedINR: Number(newAmount),
      percentage: totalBudget > 0 ? Math.round((newAmount / totalBudget) * 100) : 0,
      priority: newPriority,
      description: 'Custom expense added by organizer.',
      moneySavingTip: newTip.trim() || 'Request comparative quotes from multiple local vendors.',
      spentINR: 0,
      isBooked: false,
    };

    const updated = [...items, newItem];
    onUpdatePlan({ ...plan, budgetBreakdown: updated });
    setIsAddingNew(false);
    setNewCategory('');
    setNewAmount(50000);
    setNewTip('');
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onUpdatePlan({ ...plan, budgetBreakdown: updated });
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Must-Have':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Recommended':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Optional':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const categoryColors = [
    'bg-purple-600',
    'bg-indigo-600',
    'bg-blue-600',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  return (
    <div className="space-y-8">
      {/* Overall Budget Warning Alert if expenses exceed budget */}
      {isOverallOverBudget && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-rose-900 shadow-sm animate-in fade-in">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-extrabold text-sm text-rose-950 flex items-center gap-2">
              <span>Overall Event Budget Exceeded</span>
              <span className="text-xs bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded-md font-bold">
                Deficit: {formatINR(totalSpent - totalBudget)}
              </span>
            </h5>
            <p className="text-xs text-rose-800 leading-relaxed">
              Total tracked expenses ({formatINR(totalSpent)}) currently exceed your total budget of {formatINR(totalBudget)} by {formatINR(totalSpent - totalBudget)}. Review individual category expenses or negotiate quotes with vendors to bring your event back within budget.
            </p>
          </div>
        </div>
      )}

      {/* Top Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Target Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Event Budget</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatINR(totalBudget)}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Calculated for {plan.input.guestCount} guests ({formatCompactINR(plan.input.guestCount > 0 ? Math.round(totalBudget / plan.input.guestCount) : 0)}/guest)
          </div>
        </div>

        {/* AI Allocated Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Planned Allocation</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <PieChart className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-blue-900">{formatINR(totalAllocated)}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {bufferVariance >= 0 ? (
              <span className="text-emerald-600 font-semibold">
                ✓ {formatINR(bufferVariance)} unallocated safety buffer
              </span>
            ) : (
              <span className="text-rose-600 font-semibold">
                ⚠ Exceeds target by {formatINR(Math.abs(bufferVariance))}
              </span>
            )}
          </div>
        </div>

        {/* Tracked Actual Spent / Booked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tracked Spent / Booked</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatINR(totalSpent)}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of total funds committed
          </div>
        </div>

        {/* Remaining Spendable Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {remainingBudget >= 0 ? 'Remaining Balance' : 'Budget Deficit'}
            </span>
            <span className={`p-2 rounded-xl ${remainingBudget >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className={`text-2xl font-black ${remainingBudget >= 0 ? 'text-indigo-900' : 'text-rose-600'}`}>
            {formatINR(remainingBudget)}
          </div>
          <div className="text-[11px] mt-1 font-medium">
            {remainingBudget >= 0 ? (
              <span className="text-slate-500">Available for remaining categories</span>
            ) : (
              <span className="text-rose-600 font-semibold">⚠ Over budget by {formatINR(Math.abs(remainingBudget))}</span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Category Distribution Bar & Budget Percentage Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-600" />
            <span>Budget Percentage Breakdown</span>
          </h4>
          <span className="text-xs text-slate-500 font-semibold">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% Spent ({formatINR(totalSpent)} / {formatINR(totalBudget)})
          </span>
        </div>

        {/* Multi-segment Visual Progress Bar: dynamically updates with Actual Spent */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {totalSpent > 0 ? (
            items.map((item, idx) => {
              const color = categoryColors[idx % categoryColors.length];
              const spent = Number(item.spentINR) || 0;
              if (spent <= 0) return null;
              
              // Category percentage of total budget
              const pct = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
              const roundedPct = Math.round(pct);
              return (
                <div
                  key={item.id}
                  title={`${item.category}: ${formatINR(spent)} (${roundedPct}% of total budget)`}
                  className={`${color} hover:opacity-85 transition-all duration-300`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              );
            })
          ) : (
            <div className="w-full h-full bg-slate-100 text-slate-400 text-[10px] flex items-center justify-center font-medium">
              No expenses tracked yet
            </div>
          )}
        </div>

        {/* Legend Chips: dynamically displays updated spent amounts & percentages */}
        <div className="flex flex-wrap gap-2 pt-2">
          {items.map((item, idx) => {
            const dotColor = categoryColors[idx % categoryColors.length];
            const spent = Number(item.spentINR) || 0;
            const spentPct = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;
            return (
              <div
                key={item.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
              >
                <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                <span className="font-semibold">{item.category}:</span>
                <span className="text-slate-500 font-medium">
                  {formatINR(spent)} ({spentPct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Cards List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Itemized Expenses & AI Money-Saving Tips
            </h3>
            <p className="text-xs text-slate-500">
              Track actual quotes, toggle booked status, and review insider negotiation strategies.
            </p>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Expense</span>
          </button>
        </div>

        {/* Add custom expense form */}
        {isAddingNew && (
          <form onSubmit={handleAddItem} className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800">New Budget Line Item</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Favors / Stage Fireworks"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allocated Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="5000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Must-Have">Must-Have</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Optional">Optional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Money-Saving Hack / Note</label>
              <input
                type="text"
                placeholder="e.g. Negotiate package discount or purchase in bulk from Sadar Bazar"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs cursor-pointer"
              >
                Add Category
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => {
            const spent = Number(item.spentINR) || 0;
            const allocated = Number(item.allocatedINR) || 0;
            const isOverAllocated = spent > allocated;
            const spentPercentage = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  isOverAllocated
                    ? 'border-rose-300 bg-rose-50/15'
                    : item.isBooked
                    ? 'border-emerald-200/80 bg-emerald-50/10'
                    : 'border-slate-200/80 hover:border-indigo-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Title, badges, description */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleToggleBooked(item.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                        title={item.isBooked ? 'Mark as Pending' : 'Mark as Booked'}
                      >
                        {item.isBooked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      <h4 className="text-base font-bold text-slate-900">
                        {item.category}
                      </h4>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityBadgeClass(item.priority)}`}>
                        {item.priority}
                      </span>

                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {spentPercentage}% of Budget
                      </span>

                      {item.isBooked && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          ✓ Booked
                        </span>
                      )}

                      {/* Over-allocation warning badge */}
                      {isOverAllocated && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Exceeds Allocation by {formatINR(spent - allocated)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* AI Money Saving Tip Box */}
                    {item.moneySavingTip && (
                      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-950">AI Money-Saving Hack: </span>
                          <span>{item.moneySavingTip}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Numbers and Spend Tracker */}
                  <div className="md:w-64 bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 space-y-3 shrink-0">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-semibold text-slate-500">Allocated Budget:</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatINR(allocated)}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-slate-600">Actual Spent:</span>
                        <span className={isOverAllocated ? 'text-rose-600 font-bold' : 'text-slate-800 font-bold'}>
                          {formatINR(spent)}
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={item.spentINR !== undefined && item.spentINR !== null ? item.spentINR : ''}
                          onChange={(e) => handleUpdateSpent(item.id, e.target.value)}
                          placeholder="0"
                          className={`w-full pl-6 pr-3 py-1.5 rounded-lg bg-white border text-xs font-semibold focus:outline-none focus:ring-2 ${
                            isOverAllocated 
                              ? 'border-rose-300 text-rose-900 focus:ring-rose-500' 
                              : 'border-slate-300 text-slate-900 focus:ring-indigo-500'
                          }`}
                        />
                      </div>
                      {isOverAllocated && (
                        <p className="text-[10px] text-rose-600 font-semibold mt-1">
                          ⚠ Over allocation by {formatINR(spent - allocated)}
                        </p>
                      )}
                    </div>

                    {item.id.startsWith('b-custom-') && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
