import { Task } from '@/lib/types';
import { Circle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface StatsOverviewProps {
  tasks: Task[];
}

export default function StatsOverview({ tasks }: StatsOverviewProps) {
  // Calculate metrics
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const urgent = tasks.filter(t => t.category === 'Urgent' && !t.completed).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Tasks Card */}
      <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-indigo-100">
            <Circle className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="ml-3 text-sm font-medium text-brand-black">Total</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-brand-black">{total}</p>
      </div>

      {/* Completed Tasks Card */}
      <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="ml-3 text-sm font-medium text-brand-black">Completed</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-brand-black">{completed}</p>
      </div>

      {/* Pending Tasks Card */}
      <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="ml-3 text-sm font-medium text-brand-black">Pending</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-brand-black">{pending}</p>
      </div>

      {/* Urgent Tasks Card */}
      <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="ml-3 text-sm font-medium text-brand-black">Urgent</h3>
        </div>
        <p className="mt-2 text-2xl font-bold text-brand-black">{urgent}</p>
      </div>
    </div>
  );
}