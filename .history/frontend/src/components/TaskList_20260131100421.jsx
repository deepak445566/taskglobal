import React from 'react';
import TaskItem from './TaskItem';
import { FaClipboardList } from 'react-icons/fa';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-500 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-400">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
};

export default TaskList;