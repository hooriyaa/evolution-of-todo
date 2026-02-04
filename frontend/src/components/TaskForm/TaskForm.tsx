'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '@/lib/types';
import { Button } from '@/components/Button/Button';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Task>;
}

export const TaskForm = ({ isOpen, onClose, onSubmit, initialData }: TaskFormProps) => {
  // Helper function to convert date to local format for datetime input
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';

    const dateObj = new Date(date);

    // Get timezone offset in milliseconds
    const offset = dateObj.getTimezoneOffset() * 60000;
    // Create a new date adjusted for local timezone
    const localDate = new Date(dateObj.getTime() - offset);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    return localDate.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState<string>(initialData?.dueDate ? formatDateForInput(initialData.dueDate) : '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [isRecurring, setIsRecurring] = useState(initialData?.is_recurring || false);
  const [recurringRule, setRecurringRule] = useState(initialData?.recurring_rule || '');
  const [error, setError] = useState('');

  // Update form fields when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDueDate(initialData.dueDate ? formatDateForInput(initialData.dueDate) : '');
      setCategory(initialData.category || '');
      setPriority(initialData.priority || 'medium');
      setTags(initialData.tags || '');
      setIsRecurring(initialData.is_recurring || false);
      setRecurringRule(initialData.recurring_rule || '');
    } else {
      // Reset form when no initial data is provided
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategory('');
      setPriority('medium');
      setTags('');
      setIsRecurring(false);
      setRecurringRule('');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length < 1 || title.length > 200) {
      setError('Title must be between 1 and 200 characters');
      return;
    }

    setError('');

    // Create payload with backend field naming (due_date)
    const payload: any = {
      title: title.trim(),
      description: description.trim(),
      // Send null for due_date if not provided, not empty string
      // Format date to preserve user's local time without timezone conversion
      due_date: dueDate && dueDate.trim() !== "" ? new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ') : null,
      // Ensure category defaults to "Personal" if not provided
      category: category || "Personal",
      priority: priority,
      tags: tags,
      is_recurring: isRecurring,
      recurring_rule: isRecurring ? recurringRule : null
    };

    // Explicitly log the payload before sending as required by the fix
    console.log("PAYLOAD SENDING:", payload);

    try {
      // Pass the properly formatted payload to the parent component
      await onSubmit(payload as Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>);

      // Reset form after submission
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategory('');
      setPriority('medium');
      setTags('');
      setIsRecurring(false);
      setRecurringRule('');

      // Close the modal after a short delay to allow the parent component to handle the submission
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("Error saving task:", error);
      setError('Failed to save task. Please try again.');
    }
  };

  const handleClose = () => {
    setError('');
    // Reset form when closing
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setDueDate(initialData?.dueDate ? formatDateForInput(initialData.dueDate) : '');
    setCategory(initialData?.category || '');
    setPriority(initialData?.priority || 'medium');
    setTags(initialData?.tags || '');
    setIsRecurring(initialData?.is_recurring || false);
    setRecurringRule(initialData?.recurring_rule || '');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-brand-card rounded-3xl shadow-sm w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-brand-black">
            {initialData ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="text-brand-gray hover:text-brand-black"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-brand-black mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white text-gray-900 border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-brand-lime"
              placeholder="Enter task title"
              maxLength={200}
            />
            <p className="text-xs text-brand-gray mt-1">Between 1 and 200 characters</p>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-brand-black mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-gray-900 border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-brand-lime"
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium text-brand-black mb-1">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              value={dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white text-gray-900 border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-brand-lime"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-brand-black mb-1">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {(['low', 'medium', 'high'] as const).map((prio) => (
                <label
                  key={prio}
                  className={`flex items-center px-3 py-2 rounded-full text-sm cursor-pointer ${
                    priority === prio
                      ? prio === 'low' ? 'bg-green-200 text-green-800'
                        : prio === 'medium' ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800' // high
                      : 'bg-gray-100 text-brand-black hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={prio}
                    checked={priority === prio}
                    onChange={() => setPriority(prio)}
                    className="sr-only"
                  />
                  {prio.charAt(0).toUpperCase() + prio.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-brand-black mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-white text-gray-900 border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-brand-lime"
              placeholder="Enter tags separated by commas (e.g. work, urgent)"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="form-checkbox h-4 w-4 text-brand-lime focus:ring-brand-lime"
              />
              <span className="text-sm font-medium text-brand-black">Recurring Task</span>
            </label>
          </div>

          {isRecurring && (
            <div className="mb-4">
              <label htmlFor="recurringRule" className="block text-sm font-medium text-brand-black mb-1">
                Recurring Rule
              </label>
              <input
                type="text"
                id="recurringRule"
                value={recurringRule}
                onChange={(e) => setRecurringRule(e.target.value)}
                className="w-full bg-white text-gray-900 border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-brand-lime"
                placeholder="e.g. daily, weekly, monthly"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-black mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {['Design', 'Work', 'Personal', 'Urgent'].map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center px-3 py-2 rounded-full text-sm cursor-pointer ${
                    category === cat
                      ? cat === 'Design' ? 'bg-[#D4E76C] text-black'
                        : cat === 'Work' ? 'bg-[#B9B0E4] text-white'
                        : cat === 'Personal' ? 'bg-gray-300 text-black'
                        : 'bg-[#FF9A6C] text-white' // Urgent
                      : 'bg-gray-100 text-brand-black hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="sr-only"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              {initialData ? 'Save Changes' : 'Save Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};