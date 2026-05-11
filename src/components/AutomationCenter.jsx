import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAutomation } from '../context/AutomationContext';
import { getAutomationProfile, getNextTaskTime, toggleTask as toggleTaskFunc } from '../services/automationEngine';

/**
 * Automation Center Component
 * Manages all automated tasks for farm areas
 */
const AutomationCenter = () => {
  const { areas, currentArea, setCurrentArea } = useApp();
  const { tasks, addTask, toggleTask, getAreaTasks } = useAutomation();
  const [selectedArea, setSelectedArea] = useState(currentArea || 'A');
  const [showAddTask, setShowAddTask] = useState(false);
  const [nextRunTimes, setNextRunTimes] = useState({});

  // Initialize automation profile for selected area when it changes
  useEffect(() => {
    const area = areas[selectedArea];
    if (area && !getAreaTasks(selectedArea)?.length) {
      const profile = getAutomationProfile(area.cropKey);
      profile.forEach((task, idx) => {
        const taskWithArea = { ...task, areaId: selectedArea };
        addTask(selectedArea, taskWithArea);
      });
    }
  }, [selectedArea, areas, addTask, getAreaTasks]);

  // Update next run times
  useEffect(() => {
    const times = {};
    const areaTasks = getAreaTasks(selectedArea);
    areaTasks.forEach(task => {
      times[task.id] = getNextTaskTime(task);
    });
    setNextRunTimes(times);
  }, [selectedArea, getAreaTasks]);

  const areaTasks = getAreaTasks(selectedArea);
  const area = areas[selectedArea];

  const getTaskIcon = (taskType) => {
    const icons = {
      watering: '💧',
      lighting: '💡',
      climate: '🌡️',
      nutrients: '🧪',
    };
    return icons[taskType] || '⚙️';
  };

  const getTaskDescription = (task) => {
    switch (task.taskType) {
      case 'watering':
        return `When soil moisture < ${task.threshold}% (${task.duration}s, max ${task.maxDaily}x/day)`;
      case 'lighting':
        return `${task.onTime} to ${task.offTime} (${task.intensity}% intensity)`;
      case 'climate':
        return `Target: ${task.targetTemp}°C, ${task.targetHumidity}% humidity`;
      case 'nutrients':
        return `Every ${task.frequency} (${task.amount}ml of ${task.concentration})`;
      default:
        return 'Custom task';
    }
  };

  const formatNextRunTime = (date) => {
    if (!date) return 'Soon';
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 60000) return 'Now';
    if (diff < 3600000) return `${Math.round(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.round(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Automation Center</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Manage automated tasks for your farm areas</p>

      {/* Area Selection */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {Object.keys(areas).map(areaId => (
          <button
            key={areaId}
            onClick={() => setSelectedArea(areaId)}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selectedArea === areaId
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200'
            }`}
          >
            Area {areaId}
            {areas[areaId]?.crop?.name && <span className="ml-2">{areas[areaId].crop.name}</span>}
          </button>
        ))}
      </div>

      {/* Area Automation Tasks */}
      {area && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {area.crop?.name || 'Unassigned'} - Area {selectedArea}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Health Score: {area.aiScore || '--'}%</p>
          </div>

          <div className="p-6 space-y-4">
            {areaTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No automation tasks set up yet.</p>
            ) : (
              areaTasks.map(task => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg ${
                    task.enabled
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getTaskIcon(task.taskType)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                          {task.taskType} {task.enabled ? '✅' : '❌'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getTaskDescription(task)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Next run: {formatNextRunTime(nextRunTimes[task.id])}
                        </p>
                      </div>
                    </div>

                    {/* Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={task.enabled}
                        onChange={() => toggleTask(selectedArea, task.id)}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-semibold">{task.enabled ? 'On' : 'Off'}</span>
                    </label>
                  </div>

                  {/* Status */}
                  {task.enabled && (
                    <div className="ml-11 text-sm text-green-700 dark:text-green-300">
                      <span className="inline-block bg-green-200 dark:bg-green-800 px-3 py-1 rounded-full">
                        ✓ Running normally
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              {showAddTask ? '✕ Cancel' : '+ Add Custom Task'}
            </button>
          </div>
        </div>
      )}

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{areaTasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Enabled</p>
          <p className="text-3xl font-bold text-green-600">{areaTasks.filter(t => t.enabled).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Automation Status</p>
          <p className="text-3xl font-bold text-blue-600">
            {areaTasks.filter(t => t.enabled).length === areaTasks.length ? '✅' : '⚠️'}
          </p>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">💡 Quick Tips</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>✓ Toggle tasks on/off using the switches</li>
          <li>✓ Each crop type has recommended automation settings</li>
          <li>✓ Adjust thresholds based on your plants' response</li>
          <li>✓ Monitor "Next run" times to ensure tasks are scheduled</li>
        </ul>
      </div>
    </div>
  );
};

export default AutomationCenter;
