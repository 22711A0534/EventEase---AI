import React, { useState } from 'react';
import { 
  Users, 
  HelpCircle, 
  CheckSquare, 
  IndianRupee, 
  Phone, 
  Plus, 
  Edit3, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { VendorItem, VendorStatus, EventPlan } from '../types/event';

interface VendorChecklistProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
}

export const VendorChecklist: React.FC<VendorChecklistProps> = ({
  plan,
  onUpdatePlan,
}) => {
  const [vendors, setVendors] = useState<VendorItem[]>(plan.vendorChecklist);
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(vendors[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddingVendor, setIsAddingVendor] = useState<boolean>(false);

  // New vendor form state
  const [newCategory, setNewCategory] = useState<string>('');
  const [newCost, setNewCost] = useState<string>('₹50,000 - ₹1,00,000');
  const [newImportance, setNewImportance] = useState<'Critical' | 'Important' | 'Optional'>('Important');
  const [newQuestions, setNewQuestions] = useState<string>('');
  const [newDeliverables, setNewDeliverables] = useState<string>('');

  const statusOptions: VendorStatus[] = ['To Contact', 'Shortlisted', 'Negotiating', 'Booked'];

  const handleStatusChange = (id: string, newStatus: VendorStatus) => {
    const updated = vendors.map((v) => (v.id === id ? { ...v, status: newStatus } : v));
    setVendors(updated);
    onUpdatePlan({ ...plan, vendorChecklist: updated });
  };

  const handleUpdateVendorField = (id: string, field: 'vendorName' | 'notes', val: string) => {
    const updated = vendors.map((v) => (v.id === id ? { ...v, [field]: val } : v));
    setVendors(updated);
    onUpdatePlan({ ...plan, vendorChecklist: updated });
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const questionsList = newQuestions.split('\n').filter(q => q.trim().length > 0);
    const deliverablesList = newDeliverables.split('\n').filter(d => d.trim().length > 0);

    const newVendor: VendorItem = {
      id: 'v-custom-' + Date.now(),
      category: newCategory.trim(),
      estimatedCostINR: newCost.trim() || 'Custom Quote',
      importance: newImportance,
      questionsToAsk: questionsList.length > 0 ? questionsList : ['Confirm availability on the event date', 'Review cancellation terms and insurance'],
      deliverablesChecklist: deliverablesList.length > 0 ? deliverablesList : ['Signed agreement with payment milestones'],
      status: 'To Contact',
      notes: '',
    };

    const updated = [...vendors, newVendor];
    setVendors(updated);
    onUpdatePlan({ ...plan, vendorChecklist: updated });
    setIsAddingVendor(false);
    setNewCategory('');
    setNewQuestions('');
    setNewDeliverables('');
    setExpandedVendorId(newVendor.id);
  };

  const handleDeleteVendor = (id: string) => {
    const updated = vendors.filter((v) => v.id !== id);
    setVendors(updated);
    onUpdatePlan({ ...plan, vendorChecklist: updated });
  };

  const getStatusBadge = (status: VendorStatus) => {
    switch (status) {
      case 'Booked':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Negotiating':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredVendors = filterStatus === 'all'
    ? vendors
    : vendors.filter((v) => v.status === filterStatus);

  const bookedCount = vendors.filter((v) => v.status === 'Booked').length;

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              AI Vendor Checklist & Interview Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Vetted questions to ask, deliverables to demand in writing, and estimated INR cost brackets for {plan.input.location}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {bookedCount} of {vendors.length} Vendors Hired
          </div>
          <button
            onClick={() => setIsAddingVendor(!isAddingVendor)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Vendors ({vendors.length})
        </button>
        {statusOptions.map((st) => {
          const count = vendors.filter((v) => v.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Add Vendor Form */}
      {isAddingVendor && (
        <form onSubmit={handleAddVendor} className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800">Add New Vendor Category</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Category</label>
              <input
                type="text"
                required
                placeholder="e.g. DJ & Dhol Players / Saree Draper"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Cost Range (INR)</label>
              <input
                type="text"
                placeholder="e.g. ₹40,000 - ₹60,000"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Importance</label>
              <select
                value={newImportance}
                onChange={(e) => setNewImportance(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              >
                <option value="Critical">Critical</option>
                <option value="Important">Important</option>
                <option value="Optional">Optional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key Interview Questions (one per line)</label>
              <textarea
                rows={3}
                placeholder="Do you have emergency equipment backup?&#10;What are the overtime charges after midnight?"
                value={newQuestions}
                onChange={(e) => setNewQuestions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mandatory Deliverables (one per line)</label>
              <textarea
                rows={3}
                placeholder="Arrival 2 hours prior for sound check&#10;High-resolution teaser delivery within 5 days"
                value={newDeliverables}
                onChange={(e) => setNewDeliverables(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingVendor(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs"
            >
              Save Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendor Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredVendors.map((vendor) => {
          const isExpanded = expandedVendorId === vendor.id;
          return (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Header row */}
              <div 
                onClick={() => setExpandedVendorId(isExpanded ? null : vendor.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{vendor.category}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        vendor.importance === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {vendor.importance}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                      Est. Range: {vendor.estimatedCostINR}
                    </p>
                  </div>
                </div>

                {/* Right Status Controls */}
                <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={vendor.status}
                    onChange={(e) => handleStatusChange(vendor.id, e.target.value as VendorStatus)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${getStatusBadge(vendor.status)}`}
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setExpandedVendorId(isExpanded ? null : vendor.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-5 bg-slate-50/50">
                  {/* Two Column Grid: Questions & Deliverables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Questions to Ask */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Crucial Questions to Ask Before Hiring:</span>
                      </div>
                      <ul className="space-y-1.5">
                        {vendor.questionsToAsk.map((q, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deliverables Checklist */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900">
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                        <span>Deliverables Checklist & Contracts:</span>
                      </div>
                      <ul className="space-y-1.5">
                        {vendor.deliverablesChecklist.map((d, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-indigo-500 font-bold">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Organizer Notes & Vendor Name */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Hired / Shortlisted Vendor Name & Contact
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Mewar Catering / +91 98765 43210"
                        value={vendor.vendorName || ''}
                        onChange={(e) => handleUpdateVendorField(vendor.id, 'vendorName', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Negotiation Notes / Payment Milestone
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 20% advance paid, remaining on setup completion"
                        value={vendor.notes || ''}
                        onChange={(e) => handleUpdateVendorField(vendor.id, 'notes', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {vendor.id.startsWith('v-custom-') && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Custom Vendor</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
