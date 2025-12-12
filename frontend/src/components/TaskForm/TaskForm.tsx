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
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState<string>(initialData?.dueDate ? formatDateForInput(initialData.dueDate) : '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [error, setError] = useState('');

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

  // Update form fields when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDueDate(initialData.dueDate ? formatDateForInput(initialData.dueDate) : '');
      setCategory(initialData.category || '');
    } else {
      // Reset form when no initial data is provided
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategory('');
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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
      due_date: dueDate && dueDate.trim() !== "" ? new Date(dueDate).toISOString() : null,
      // Ensure category defaults to "Personal" if not provided
      category: category || "Personal"
    };

    // Explicitly log the payload before sending as required by the fix
    console.log("PAYLOAD SENDING:", payload);

    // Pass the properly formatted payload to the parent component
    onSubmit(payload as Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>);

    // Reset form after submission
    setTitle('');
    setDescription('');
    setDueDate('');
    setCategory('');
  };

  const handleClose = () => {
    setError('');
    // Reset form when closing
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setDueDate(initialData?.dueDate ? formatDateForInput(initialData.dueDate) : '');
    setCategory(initialData?.category || '');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-brand-card rounded-3xl shadow-sm w-full max-w-md">
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