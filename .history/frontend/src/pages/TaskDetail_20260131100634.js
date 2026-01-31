import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { format } from 'date-fns';
import { getTask, updateTask, deleteTask } from '../services/taskService';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await getTask(taskId);
      setTask(response.data.data);
      setEditData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch task details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      const response = await updateTask(taskId, { status: newStatus });
      setTask(response.data.data);
      setEditData(response.data.data);
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update task status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await updateTask(taskId, editData);
      setTask(response.data.data);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(task);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'in-progress':
        return <FaClock className="text-blue-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getPriorityIcon = (priority) => {
    return <FaExclamationTriangle className={
      priority === 'high' ? 'text-red-500' :
      priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
    } />;
  };

  if (loading && !task) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-500 mb-2">
          Task not found
        </h3>
        <Link
          to="/dashboard"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mt-4"
        >
          Go Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-6 py-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-900 bg-white px-3 py-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              )}
            </div>
            
            <div className="flex space-x-2 ml-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FaSave className="mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Task details */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Description
                </h3>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editData.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48"
                    placeholder="Add a description..."
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {task.description ? (
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {task.description}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">
                        No description provided
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Status
                  </h3>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    {isEditing ? (
                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <div className="flex-1">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          disabled={statusLoading}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Priority
                  </h3>
                  <div className="flex items-center space-x-3">
                    {getPriorityIcon(isEditing ? editData.priority : task.priority)}
                    {isEditing ? (
                      <select
                        name="priority"
                        value={editData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Dates */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Timeline
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaCalendarAlt className="mr-2" />
                      <span className="text-sm font-medium">Due Date</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dueDate"
                        value={editData.dueDate ? format(new Date(editData.dueDate), 'yyyy-MM-dd') : ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {task.dueDate ? format(new Date(task.dueDate), 'MMMM dd, yyyy') : 'No due date set'}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaCalendarAlt className="mr-2" />
                      <span className="text-sm font-medium">Created Date</span>
                    </div>
                    <p className="text-gray-800">
                      {format(new Date(task.createdAt), 'MMMM dd, yyyy')}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaCalendarAlt className="mr-2" />
                      <span className="text-sm font-medium">Last Updated</span>
                    </div>
                    <p className="text-gray-800">
                      {format(new Date(task.updatedAt), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange('completed')}
                        disabled={statusLoading}
                        className="w-full flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaCheckCircle className="mr-2" />
                        Mark as Complete
                      </button>
                    )}
                    {task.status !== 'in-progress' && task.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange('in-progress')}
                        disabled={statusLoading}
                        className="w-full flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaClock className="mr-2" />
                        Start Progress
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;