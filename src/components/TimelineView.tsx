import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  Filter, 
  Sparkles, 
  AlertCircle,
  Flag,
  Trash2
} from 'lucide-react';
import { TimelineTask, TimelinePhase, EventPlan } from '../types/event';
import { triggerConfetti } from '../utils/formatters';

interface TimelineViewProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  plan,
  onUpdatePlan,
}) => {
  const [tasks, setTasks] = useState<TimelineTask[]>(plan.timeline);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskPhase, setNewTaskPhase] = useState<TimelinePhase>('1-2 Months Before');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState<string>('4 weeks before');

  const phases: TimelinePhase[] = [
    '6-12 Months Before',
    '3-6 Months Before',
    '1-2 Months Before',
    '2-3 Weeks Before',
    'Week of Event',
    'Event Day',
    'Post-Event'
  ];

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleToggleTask = (id: string) => {
    let justCompleted = false;
    const updated = tasks.map((task) => {
      if (task.id === id) {
        const nextState = !task.isCompleted;
        if (nextState) justCompleted = true;
        return { ...task, isCompleted: nextState };
      }
      return task;
    });

    setTasks(updated);
    onUpdatePlan({ ...plan, timeline: updated });

    if (justCompleted) {
      triggerConfetti();
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TimelineTask = {
      id: 't-custom-' + Date.now(),
      phase: newTaskPhase,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Custom organizer milestone.',
      deadlineOffset: newTaskDeadline.trim() || 'Prior to event',
      category: 'Custom Task',
      isCompleted: false,
      priority: newTaskPriority,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    onUpdatePlan({ ...plan, timeline: updated });
    setIsAddingTask(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    onUpdatePlan({ ...plan, timeline: updated });
  };

  const filteredTasks = selectedPhase === 'all'
    ? tasks
    : tasks.filter((t) => t.phase === selectedPhase);

  // Group tasks by phase for chronological view
  const groupedTasks = phases.reduce((acc, phase) => {
    const match = filteredTasks.filter((t) => t.phase === phase);
    if (match.length > 0) {
      acc[phase] = match;
    }
    return acc;
  }, {} as Record<TimelinePhase, TimelineTask[]>);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'medium':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress & Milestone Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              AI Preparation Roadmap & Deadlines
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            A milestone-based countdown schedule designed for {plan.input.title} on {plan.input.date}.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="md:w-72 space-y-2 shrink-0">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Roadmap Completion</span>
            <span className="font-bold text-purple-700">{completedCount} of {tasks.length} Done ({progressPct}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-600 to-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Chips & Add Task Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedPhase === 'all'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Milestones ({tasks.length})
          </button>
          {phases.map((ph) => {
            const count = tasks.filter((t) => t.phase === ph).length;
            if (count === 0) return null;
            return (
              <button
                key={ph}
                onClick={() => setSelectedPhase(ph)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPhase === ph
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {ph} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Milestone</span>
        </button>
      </div>

      {/* Add Custom Task Form */}
      {isAddingTask && (
        <form onSubmit={handleAddTask} className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800">New Preparation Task</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Schedule final cake tasting session"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phase</label>
              <select
                value={newTaskPhase}
                onChange={(e) => setNewTaskPhase(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              >
                {phases.map((ph) => (
                  <option key={ph} value={ph}>{ph}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
              <input
                type="text"
                placeholder="Details on what needs to be verified..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deadline</label>
              <input
                type="text"
                placeholder="e.g. 3 weeks before event"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Phased Timeline Cards */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([phaseName, phaseTasks]) => (
          <div key={phaseName} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-linear-to-r from-purple-600 to-indigo-600" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                {phaseName}
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">
                ({phaseTasks.filter(t => t.isCompleted).length}/{phaseTasks.length} Done)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {phaseTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    task.isCompleted
                      ? 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-80'
                      : 'bg-white border-slate-200 hover:border-purple-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTask(task.id);
                    }}
                    className="mt-0.5 shrink-0 transition-transform active:scale-90"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-purple-500" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-bold ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${getPriorityBadge(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      {task.category && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {task.category}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed ${task.isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                      {task.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" /> {task.deadlineOffset}
                      </span>
                    </div>
                  </div>

                  {task.id.startsWith('t-custom-') && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="text-slate-300 hover:text-red-500 p-1 rounded-md transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
