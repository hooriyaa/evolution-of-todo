// frontend/src/app/dashboard/page.tsx
"use client";

import { useEffect, useState, JSX } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react"; // optional; remove if not installed
import apiClient from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar/Sidebar";
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
      if (err.response?.status === 401) {
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-black">My Tasks</h1>
        <Button
          onClick={() => {
            setEditingTask(null);
            setShowTaskForm(true);
          }}
          variant="primary"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </span>
        </Button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          <AnimatePresence>
            {tasks.map((task, index) => (
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
            <p className="text-brand-gray">No tasks yet. Add your first task!</p>
          </div>
        )}
      </div>

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

