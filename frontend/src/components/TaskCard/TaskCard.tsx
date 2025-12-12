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

export const TaskCard = ({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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

          {/* Due date and category info */}
          <div className="flex flex-wrap gap-2 mt-2">
            {(task.dueDate || task.due_date) && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {new Date(task.dueDate || task.due_date).toLocaleDateString()} {new Date(task.dueDate || task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {task.category && (
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
            )}
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
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-brand-gray hover:text-red-600 rounded-full hover:bg-brand-gray/10"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};