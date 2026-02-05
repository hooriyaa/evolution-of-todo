'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string | number) => void;
  onDelete: (taskId: string | number) => void;
  onEdit: (task: Task) => void;
}

// Function to get category color
const getCategoryColor = (category: string | undefined) => {
  if (!category) return 'bg-gray-300 text-black';

  switch (category) {
    case 'Design':
      return 'bg-[#D4E76C] text-black';
    case 'Work':
      return 'bg-[#B9B0E4] text-white';
    case 'Personal':
      return 'bg-gray-300 text-black';
    case 'Urgent':
      return 'bg-[#FF9A6C] text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};

// Function to get priority color
const getPriorityColor = (priority: string | undefined) => {
  if (!priority) return 'bg-gray-300 text-black';

  switch (priority) {
    case 'low':
      return 'bg-green-200 text-green-800';
    case 'medium':
      return 'bg-yellow-200 text-yellow-800';
    case 'high':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-300 text-black';
  }
};

// Function to render tags
const renderTags = (tags: string | undefined) => {
  if (!tags) return null;

  // Split tags by comma and trim whitespace
  const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tagList.map((tag, index) => (
        <span
          key={index}
          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export const TaskCard = ({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Track deletion state

  // Handle delete with immediate feedback
  const handleDelete = async () => {
    setIsDeleting(true); // Show immediate feedback

    try {
      await onDelete(task.id); // Call the parent's delete function
      // Card will be hidden by parent component after successful deletion
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsDeleting(false); // Revert to normal state if there's an error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-brand-card p-5 rounded-3xl shadow-sm border border-black/5 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        {/* Checkbox on left */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 mr-3 text-brand-black focus:outline-none"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle className="w-5 h-5 text-brand-purple" fill="currentColor" />
          ) : (
            <Circle className="w-5 h-5 text-brand-gray" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg text-brand-black ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mt-1 ${task.completed ? 'text-brand-gray/70' : 'text-brand-black/80'}`}>
              {task.description}
            </p>
          )}

          {/* Due date, priority, tags and category info */}
          <div className="flex flex-wrap gap-2 mt-2">
            {(task.dueDate || task.due_date) && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {(() => {
                  const dateValue = task.dueDate || task.due_date;
                  if (dateValue) {
                    // Fix: Ensure the browser treats this as UTC so it converts to Local Time
                    const safeDateString = typeof dateValue === 'string' && dateValue.endsWith('Z') ? dateValue : `${dateValue}Z`;

                    const date = new Date(safeDateString);

                    // Double Check: If the date is invalid, fallback to original string
                    if (isNaN(date.getTime())) return typeof dateValue === 'string' ? dateValue : "Invalid Date";

                    return date.toLocaleString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });
                  }
                  return "No Due Date";
                })()}
              </span>
            )}
            {task.priority && (
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}
            {task.category && (
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
            )}
            {renderTags(task.tags)}
          </div>

          {/* Status Badge */}
          {task.completed && (
            <span className="mt-2 inline-block bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-full text-xs font-bold">
              Completed
            </span>
          )}
        </div>

        {/* Action buttons on right - visible on hover */}
        <div className={`flex space-x-2 ml-2 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-brand-gray hover:text-brand-black rounded-full hover:bg-brand-gray/10"
            aria-label="Edit task"
            disabled={isDeleting}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1 rounded-full hover:bg-brand-gray/10 ${isDeleting ? 'text-gray-400' : 'text-brand-gray hover:text-red-600'}`}
            aria-label="Delete task"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};