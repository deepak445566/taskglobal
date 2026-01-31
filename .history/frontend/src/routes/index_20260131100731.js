import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import TaskDetail from '../pages/TaskDetail';
import Layout from '../components/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks">
          <Route path=":taskId" element={<TaskDetail />} />
        </Route>
       
      </Route>
    </Routes>
  );
};

export default AppRoutes;