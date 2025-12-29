// frontend/src/app/dashboard/page.tsx
"use client";

import { useEffect, useState, JSX } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react"; // optional; remove if not installed
import apiClient from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button/Button";
import { TaskCard } from "@/components/TaskCard/TaskCard";
import { TaskForm } from "@/components/TaskForm/TaskForm";
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from "@/lib/types";

export default function DashboardPage(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Check auth status on mount
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchTasks();
    }
  }, [user, authLoading, router]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await apiClient.get('/api/tasks');
      setTasks(res.data ?? []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      // The API client's response interceptor will handle 401 errors
      if (err.response?.status === 401) {
        // Token is invalid or expired, logout the user
        router.push("/login");
      } else {
        setError(err.message || "Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: any) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }
    try {
      // Ensure due_date field is properly named for backend compatibility
      const formattedTaskData = {
        ...taskData
      };

      const res = await apiClient.post('/api/tasks', formattedTaskData);
      setTasks((prev) => [...prev, res.data]);
      setShowTaskForm(false);
    } catch (err: any) {
      console.error("Error adding task:", err);
      setError(err.message || "Failed to add task");
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask || !user) return;
    try {
      const res = await apiClient.put(`/api/tasks/${editingTask.id}`, taskData);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? res.data : t)));
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (err: any) {
      console.error("Error updating task:", err);
      setError(err.message || "Failed to update task");
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    if (!user) return;
    try {
      // optimistic update
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
      const res = await apiClient.patch(`/api/tasks/${taskId}/complete`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    } catch (err: any) {
      // revert
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
      console.error("Error updating task completion:", err);
      setError(err.message || "Failed to update task completion");
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!user) return;
    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      console.error("Error deleting task:", err);
      setError(err.message || "Failed to delete task");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
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
          <p className="mt-6 text-lg font-medium text-brand-black">Loading your tasks...</p>
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
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-brand-black pl-16 md:pl-0">My Tasks</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
            variant="primary"
            className="w-full sm:w-auto"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-white border border-brand-gray/30 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-brand-lime"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-gray/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="relative w-full md:w-48">
          <select
            className="w-full bg-white border border-brand-gray/30 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-brand-lime hover:border-brand-lime appearance-none pr-10"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All" className="hover:ring-brand-lime focus:border-brand-lime hover:border-brand-lime">All Categories</option>
            <option value="Work" className="focus:ring-brand-lime focus:border-brand-lime hover:border-brand-lime">Work</option>
            <option value="Personal" className="focus:ring-brand-lime focus:border-brand-lime hover:border-brand-lime">Personal</option>
            <option value="Urgent" className="focus:ring-brand-lime focus:border-brand-lime hover:border-brand-lime">Urgent</option>
            <option value="Design" className="focus:ring-brand-lime focus:border-brand-lime hover:border-brand-lime">Design</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-gray">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Filter the tasks based on search query and selected category */}
      {(() => {
        const filteredTasks = tasks.filter(task => {
          const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
          const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });

        return (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {filteredTasks.length > 0 ? (
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TaskCard
                      task={{...task, createdAt: task.createdAt}}
                      onToggleComplete={(taskId) => { toggleTaskCompletion(typeof taskId === 'number' ? taskId : parseInt(taskId)); }}
                      onDelete={(taskId) => { deleteTask(typeof taskId === 'number' ? taskId : parseInt(taskId)); }}
                      onEdit={handleEditTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-12 col-span-full">
                {tasks.length > 0 ? (
                  <p className="text-brand-gray">No tasks found matching your search.</p>
                ) : (
                  <p className="text-brand-gray">No tasks yet. Add your first task!</p>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Task form modal / drawer placeholder */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={async (payload) => {
          if (editingTask) await handleUpdateTask(payload as Partial<Task>);
          else await handleAddTask({ ...payload, completed: false } as Omit<Task, "id" | "created_at" | "updated_at" | "user_id">);
          setShowTaskForm(false);
        }}
        initialData={editingTask ? { ...editingTask, description: editingTask.description ?? undefined } : undefined}
      />
    </div>
  );
}

