/**
 * Automation Context
 * Manages state for automated tasks across the farm
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const AutomationContext = createContext();

export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error('useAutomation must be used within AutomationProvider');
  }
  return context;
};

export const AutomationProvider = ({ children }) => {
  const [tasks, setTasks] = useState({}); // { areaId: [tasks] }
  const [executions, setExecutions] = useState([]); // History of task executions
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [selectedAreaAutomation, setSelectedAreaAutomation] = useState(null);
  const [taskExecutionLog, setTaskExecutionLog] = useState([]);

  // Add task for an area
  const addTask = useCallback((areaId, task) => {
    setTasks(prev => ({
      ...prev,
      [areaId]: [...(prev[areaId] || []), task],
    }));
  }, []);

  // Update task
  const updateTask = useCallback((areaId, taskId, updates) => {
    setTasks(prev => ({
      ...prev,
      [areaId]: prev[areaId].map(t => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  }, []);

  // Remove task
  const removeTask = useCallback((areaId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [areaId]: prev[areaId].filter(t => t.id !== taskId),
    }));
  }, []);

  // Toggle task
  const toggleTask = useCallback((areaId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [areaId]: prev[areaId].map(t =>
        t.id === taskId ? { ...t, enabled: !t.enabled } : t
      ),
    }));
  }, []);

  // Log task execution
  const logExecution = useCallback((execution) => {
    setTaskExecutionLog(prev => [
      ...prev.slice(-99), // Keep last 100 executions
      {
        ...execution,
        id: `exec_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  // Get tasks for area
  const getAreaTasks = useCallback((areaId) => {
    return tasks[areaId] || [];
  }, [tasks]);

  // Get all enabled tasks
  const getAllEnabledTasks = useCallback(() => {
    const allTasks = [];
    Object.keys(tasks).forEach(areaId => {
      tasks[areaId].forEach(task => {
        if (task.enabled) {
          allTasks.push({ ...task, areaId });
        }
      });
    });
    return allTasks;
  }, [tasks]);

  const value = {
    tasks,
    executions,
    automationEnabled,
    selectedAreaAutomation,
    taskExecutionLog,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    logExecution,
    getAreaTasks,
    getAllEnabledTasks,
    setAutomationEnabled,
    setSelectedAreaAutomation,
  };

  return (
    <AutomationContext.Provider value={value}>
      {children}
    </AutomationContext.Provider>
  );
};
