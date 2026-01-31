import React from 'react';
import { 
  FaTasks, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle 
} from 'react-icons/fa';

const TaskStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    highPriority: tasks.filter(task => task.priority === 'high').length
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: FaTasks,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: FaClock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Task Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Completion Rate</span>
          <span className="font-semibold">
            {stats.total > 0 
              ? `${Math.round((stats.completed / stats.total) * 100)}%` 
              : '0%'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;