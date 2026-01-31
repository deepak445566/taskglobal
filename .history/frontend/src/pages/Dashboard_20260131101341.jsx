import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskStats from '../components/TaskStats';
import { getTasks, searchTasks } from '../services/taskService';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const create = searchParams.get('create') === 'true';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchTasks();
      return;
    }

    try {
      setLoading(true);
      const response = await searchTasks(searchQuery);
      setTasks(response.data.data);
    } catch (error) {
      toast.error('Failed to search tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    toast.success('Task created successfully!');
  
    searchParams.delete('create');
    setSearchParams(searchParams);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    toast.success('Task updated successfully!');
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
    toast.success('Task deleted successfully!');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'priority-high') return task.priority === 'high';
    if (filter === 'priority-medium') return task.priority === 'medium';
    if (filter === 'priority-low') return task.priority === 'low';
    return task.status === filter;
  });

  const handleFilterChange = (newFilter) => {
    setSearchParams({ filter: newFilter });
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Task Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and track all your tasks in one place
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
        <div className="lg:col-span-1 space-y-6">
          {create && <TaskForm onTaskCreated={handleTaskCreated} />}
          <TaskStats tasks={tasks} />
        </div>

       
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Tasks
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Search
                  </button>
                </form>
                
                <button
                  onClick={fetchTasks}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Refresh
                </button>
              </div>
            </div>

       
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaFilter className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Tasks' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'priority-high', label: 'High Priority' },
                  { value: 'priority-medium', label: 'Medium Priority' },
                  { value: 'priority-low', label: 'Low Priority' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => handleFilterChange(filterOption.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filter === filterOption.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

         
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            )}

            {/* Task summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
                <span>
                  {tasks.length > 0 && (
                    `${Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}% completed`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;