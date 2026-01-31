import React, { useState } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt 
} from 'react-icons/fa';
import { updateTask, deleteTask } from '../services/taskService';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...task });
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await updateTask(task._id, { status: newStatus });
      onTaskUpdated(response.data.data);
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        setLoading(true);
        const response = await updateTask(task._id, editData);
        onTaskUpdated(response.data.data);
        setIsEditing(false);
        toast.success('Task updated successfully');
      } catch (error) {
        toast.error('Failed to update task');
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await deleteTask(task._id);
        onTaskDeleted(task._id);
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setLoading(false);
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleInputChange}
            className="input-field font-medium"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleInputChange}
            className="input-field"
            rows="2"
          />
          <div className="flex justify-between">
            <select
              name="priority"
              value={editData.priority}
              onChange={handleInputChange}
              className="input-field w-32"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate ? format(new Date(editData.dueDate), 'yyyy-MM-dd') : ''}
              onChange={handleInputChange}
              className="input-field w-40"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-lg text-gray-800">
              {task.title}
            </h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-3">{task.description}</p>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {task.dueDate && (
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </span>
              )}
              <span>
                Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>

            <div className="flex space-x-2">
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={loading}
                  className="btn-primary text-sm flex items-center"
                >
                  <FaCheck className="mr-1" /> Complete
                </button>
              )}
              
              <button
                onClick={handleEdit}
                disabled={loading}
                className="btn-secondary text-sm flex items-center"
              >
                <FaEdit className="mr-1" /> {isEditing ? 'Save' : 'Edit'}
              </button>
              
              <button
                onClick={handleDelete}
                disabled={loading}
                className="btn-danger text-sm flex items-center"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;