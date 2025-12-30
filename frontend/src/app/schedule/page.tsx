'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { Task } from '@/lib/types';
import { Calendar, Clock, X, Eye } from 'lucide-react';

const SchedulePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Helper function to compare if two dates are the same day, handling timezone properly
  const isSameDay = (date1: Date | string, date2: Date | string) => {
    // Handle null/undefined values
    if (!date1 || !date2) {
      return false;
    }

    // Create date objects and normalize to just the date part (ignoring time and timezone)
    const normalizeDate = (dateInput: Date | string): Date => {
      if (typeof dateInput === 'string') {
        // If it's a date string, create a new Date object
        // If it's in ISO format with time, we'll extract just the date part
        const date = new Date(dateInput);
        // Create a new date object with just the year, month, and day
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      } else {
        // If it's already a Date object, extract just the date part
        return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
      }
    };

    const normalizedDate1 = normalizeDate(date1);
    const normalizedDate2 = normalizeDate(date2);

    // Handle potential invalid dates
    if (isNaN(normalizedDate1.getTime()) || isNaN(normalizedDate2.getTime())) {
      return false;
    }

    // Compare the normalized dates
    return normalizedDate1.getTime() === normalizedDate2.getTime();
  };

  // Check auth status on mount
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchTasks();
      generateDateRange();
    }
  }, [user, authLoading, router, selectedDate]); // Added selectedDate dependency

  // Function to open date picker
  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Handle date selection from date picker
  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedDate = e.target.value;
    if (newSelectedDate) {
      setSelectedDate(newSelectedDate);
      generateDateRange(newSelectedDate);
    }
  };

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Fetch all tasks for the user, regardless of completion status
      const res = await apiClient.get('/api/tasks');
      setTasks(res.data);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate date range for 7 days starting from the selected date
  const generateDateRange = (startDate: string = selectedDate) => {
    const dates = [];
    const start = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      // Format to YYYY-MM-DD to ensure consistency
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dates.push(formattedDate);
    }

    setDateRange(dates);
  };

  // Get tasks for the selected date and hour
  const getTasksForHour = (date: string, hour: number) => {
    return tasks.filter(task => {
      // Use due_date if available, otherwise fallback to dueDate
      const taskDueDate = task.due_date || task.dueDate;

      if (!taskDueDate) {
        return false;
      }

      // Check if the task's date matches the selected date using helper function
      const isSameDate = isSameDay(taskDueDate, date);

      // Check if the task's hour matches the current hour
      // We still need to convert to date object to get the hour
      const taskDate = new Date(taskDueDate);
      const taskHour = taskDate.getHours();
      const isSameHour = taskHour === hour;

      return isSameDate && isSameHour;
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get category color
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

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-brand-lime rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-brand-black">Loading your schedule...</p>
          <div className="mt-4 flex space-x-2">
            <div className="w-3 h-3 bg-brand-lime rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-brand-lime rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-brand-lime rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black pl-16 md:pl-0">Schedule</h1>
            <p className="text-brand-gray pl-16 md:pl-0">Manage tasks by time and date</p>
          </div>
          {/* Calendar Button */}
          <button
            onClick={openDatePicker}
            className="flex items-center gap-2 px-4 py-2 bg-brand-lime text-brand-black rounded-full font-medium hover:bg-brand-lime/90 transition-colors w-full sm:w-auto justify-center"
          >
            <Calendar className="w-4 h-4" />
            <span>Change Date</span>
          </button>
          {/* Hidden date input */}
          <input
            type="date"
            ref={dateInputRef}
            onChange={handleDateSelect}
            className="hidden"
            value={selectedDate}
            data-testid="date-picker-input"
          />
        </div>
      </div>

      {/* Date Strip */}
      <div className="mb-6">
        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide max-w-full">
          {dateRange.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedDate === date
                  ? 'bg-brand-lime text-brand-black'
                  : 'bg-gray-100 text-brand-black hover:bg-gray-200'
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-brand-black">
            {formatDate(selectedDate)}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Timeline for all 24 hours */}
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i; // Start from 0 (12 AM) to 23 (11 PM)
            // Find tasks for that hour
            const tasksForHour = tasks.filter(t => {
              // Use due_date if available, otherwise fallback to dueDate
              const taskDueDate = t.due_date || t.dueDate;
              if (!taskDueDate) {
                return false;
              }

              // Check if the task's date matches the selected date using helper function
              const isSameDate = isSameDay(taskDueDate, selectedDate);

              // Check if the task's hour matches the current hour
              const taskDate = new Date(taskDueDate);
              const taskHour = taskDate.getHours();
              const isSameHour = taskHour === hour;

              return isSameDate && isSameHour;
            });

            return (
              <div key={hour} className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-20 flex-shrink-0 pt-1 mb-2 sm:mb-0">
                  <span className="text-sm text-brand-gray">
                    {hour === 0 ? '12 AM' :
                     hour < 12 ? `${hour} AM` :
                     hour === 12 ? '12 PM' :
                     `${hour - 12} PM`}
                  </span>
                </div>
                <div className="flex-1 ml-0 sm:ml-4">
                  {tasksForHour.length > 0 ? (
                    <div className="space-y-2">
                      {tasksForHour.map((taskForHour) => {
                        // Calculate the time from the due date
                        const taskDueDate = taskForHour.due_date || taskForHour.dueDate;
                        let timeString = '';
                        if (taskDueDate) {
                          const date = new Date(taskDueDate);
                          const hours = date.getHours();
                          const minutes = date.getMinutes().toString().padStart(2, '0');
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          const displayHour = hours % 12 || 12;
                          timeString = `${displayHour}:${minutes} ${ampm}`;
                        }

                        return (
                          <div
                            key={taskForHour.id}
                            className={`p-3 rounded-xl ${getCategoryColor(taskForHour.category)} shadow-sm cursor-pointer`}
                            onClick={() => {
                              setSelectedTask(taskForHour);
                              setIsModalOpen(true);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-bold flex-grow text-sm">{taskForHour.title}</div>
                              <Eye size={16} className="ml-2 text-current opacity-70" />
                            </div>
                            <div className="flex items-center text-xs opacity-80 mt-1">
                              <Clock size={14} className="mr-1" />
                              <span>{timeString}</span>
                            </div>
                            {taskForHour.category && (
                              <div className="mt-1">
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/30">
                                  {taskForHour.category}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-brand-gray/50 py-1">No tasks scheduled</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Details Modal */}
      {isModalOpen && selectedTask && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-brand-black break-words">{selectedTask.title}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-brand-gray hover:text-brand-black ml-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedTask.description && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-brand-gray mb-1">Description</h4>
                <p className="text-brand-black">{selectedTask.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-brand-gray mb-1">Time</h4>
                <p className="text-brand-black">
                  {selectedTask.due_date || selectedTask.dueDate
                    ? new Date(selectedTask.due_date || selectedTask.dueDate!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Not set'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-gray mb-1">Category</h4>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedTask.category)}`}>
                  {selectedTask.category || 'Uncategorized'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-gray mb-1">Date</h4>
                <p className="text-brand-black">
                  {selectedTask.due_date || selectedTask.dueDate
                    ? new Date(selectedTask.due_date || selectedTask.dueDate!).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-gray mb-1">Status</h4>
                <p className="text-brand-black">{selectedTask.completed ? 'Completed' : 'Pending'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-brand-gray mb-2">Created</h4>
              <p className="text-brand-black">
                {selectedTask.createdAt
                  ? new Date(selectedTask.createdAt).toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;