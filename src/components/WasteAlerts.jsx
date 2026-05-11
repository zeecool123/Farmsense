import React, { useEffect, useState } from 'react';
import { detectAllWaste, calculateSavingsPotential, getTopPriorityAction } from '../services/wasteDetectionService';

/**
 * Waste Alerts Component
 * Displays water and electricity waste detection alerts with suggested actions
 */
const WasteAlerts = ({ areaData, sensorHistory = [] }) => {
  const [wasteData, setWasteData] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    if (areaData) {
      const detected = detectAllWaste(areaData, sensorHistory);
      setWasteData(detected);
    }
  }, [areaData, sensorHistory]);

  if (!wasteData) {
    return <div className="p-6 text-gray-500">Loading waste analysis...</div>;
  }

  const activeAlerts = [
    ...wasteData.critical,
    ...wasteData.warnings,
    ...wasteData.notices,
  ].filter(a => !dismissedAlerts.has(a.type));

  const allAlerts = [...wasteData.critical, ...wasteData.warnings, ...wasteData.notices];
  const savingsPotential = calculateSavingsPotential(allAlerts);
  const topAction = getTopPriorityAction(allAlerts);

  const getSeverityIcon = severity => {
    if (severity === 'critical') return '🔴';
    if (severity === 'warning') return '🟡';
    return 'ℹ️';
  };

  const getSeverityColor = severity => {
    if (severity === 'critical') return 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800';
    if (severity === 'warning') return 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800';
    return 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800';
  };

  const dismissAlert = type => {
    setDismissedAlerts(prev => new Set([...prev, type]));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">System Alerts & Waste Detection</h1>
          <p className="text-gray-600 dark:text-gray-400">AI-powered detection of water and electricity waste</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-red-600">{wasteData.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Issues detected</p>
        </div>
      </div>

      {/* Potential Savings Banner */}
      {savingsPotential.weeklySavings > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 mb-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">💰 Potential Weekly Savings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-90">Water Savings</p>
              <p className="text-3xl font-bold">${savingsPotential.weeklySavings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Monthly Savings</p>
              <p className="text-3xl font-bold">${(savingsPotential.monthlySavings).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Yearly Savings</p>
              <p className="text-3xl font-bold">${(savingsPotential.yearlySavings).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Priority Action */}
      {topAction && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎯</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Top Priority Action</h3>
              <p className="text-red-800 dark:text-red-200 mb-3">{topAction.explanation}</p>
              <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition">
                {topAction.action}
              </button>
              <p className="text-sm text-red-700 dark:text-red-300 mt-3">
                💰 Save: <strong>{topAction.savings}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alert Categories */}
      <div className="space-y-6">
        {/* Critical Alerts */}
        {wasteData.critical.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">🔴 Critical Issues ({wasteData.critical.length})</h2>
            <div className="space-y-4">
              {wasteData.critical
                .filter(a => !dismissedAlerts.has(a.type))
                .map(alert => (
                  <AlertCard key={alert.type} alert={alert} onDismiss={dismissAlert} />
                ))}
            </div>
          </div>
        )}

        {/* Warning Alerts */}
        {wasteData.warnings.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4">🟡 Warnings ({wasteData.warnings.length})</h2>
            <div className="space-y-4">
              {wasteData.warnings
                .filter(a => !dismissedAlerts.has(a.type))
                .map(alert => (
                  <AlertCard key={alert.type} alert={alert} onDismiss={dismissAlert} />
                ))}
            </div>
          </div>
        )}

        {/* Info Alerts */}
        {wasteData.notices.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">ℹ️ Notices ({wasteData.notices.length})</h2>
            <div className="space-y-4">
              {wasteData.notices
                .filter(a => !dismissedAlerts.has(a.type))
                .map(alert => (
                  <AlertCard key={alert.type} alert={alert} onDismiss={dismissAlert} />
                ))}
            </div>
          </div>
        )}

        {/* No Alerts */}
        {activeAlerts.length === 0 && wasteData.total === 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">All Systems Running Efficiently!</p>
            <p className="text-green-800 dark:text-green-200 mt-2">No waste detected. Your farm is optimized!</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Individual Alert Card Component
 */
const AlertCard = ({ alert, onDismiss }) => {
  const getSeverityColor = severity => {
    if (severity === 'critical') return 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800';
    if (severity === 'warning') return 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800';
    return 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800';
  };

  return (
    <div className={`p-6 border-l-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{alert.message}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{alert.explanation}</p>

          {/* Wastage Estimate */}
          <div className="bg-white dark:bg-gray-800 rounded p-3 mb-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💧 Wastage Estimate:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">% Waste</p>
                <p className="font-bold">{alert.wastageEstimate.water}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Daily</p>
                <p className="font-bold">{alert.wastageEstimate.daily}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Weekly</p>
                <p className="font-bold">{alert.wastageEstimate.weekly}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Cost</p>
                <p className="font-bold text-red-600">{alert.wastageEstimate.cost}</p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 What to do:</p>
            <ul className="space-y-1">
              {alert.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                  • {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-2 mt-4 md:mt-0">
          <button
            onClick={() => alert.action && alert.action()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition text-sm whitespace-nowrap"
          >
            Fix Now
          </button>
          <button
            onClick={() => onDismiss(alert.type)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-gray-900 dark:text-white rounded font-semibold transition text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteAlerts;
