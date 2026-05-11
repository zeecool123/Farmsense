import React, { useEffect, useState } from 'react';
import { useResources } from '../context/ResourceContext';

/**
 * Resource Dashboard Component
 * Shows water and electricity usage with efficiency scores and savings potential
 */
const ResourceDashboard = () => {
  const { resourceData, getResourceTrends, getEfficiencyScores, getPotentialSavings, getCostBreakdown } = useResources();
  const [trends, setTrends] = useState(null);
  const [efficiency, setEfficiency] = useState(null);
  const [savings, setSavings] = useState(null);
  const [costs, setCosts] = useState(null);

  useEffect(() => {
    setTrends(getResourceTrends(7));
    setEfficiency(getEfficiencyScores());
    setSavings(getPotentialSavings());
    setCosts(getCostBreakdown('month'));
  }, [getResourceTrends, getEfficiencyScores, getPotentialSavings, getCostBreakdown]);

  const getEfficiencyColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-900';
    if (score >= 60) return 'bg-yellow-100 text-yellow-900';
    return 'bg-red-100 text-red-900';
  };

  const getEfficiencyBadge = (score) => {
    if (score >= 80) return '✅ Excellent';
    if (score >= 60) return '⚠️ Good';
    return '❌ Needs Work';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Resource Management</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Track and optimize your water and electricity usage</p>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Water Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">💧 Water Usage</p>
              <p className="text-3xl font-bold text-blue-600">
                {trends?.water.toFixed(1) || '--'} {resourceData.water.unit}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">7-day average per day</p>
            </div>
            <div className={`text-center p-4 rounded-lg ${getEfficiencyColor(efficiency?.water || 0)}`}>
              <p className="text-2xl font-bold">{efficiency?.water || '--'}%</p>
              <p className="text-xs">Efficiency</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: {resourceData.water.target}L/day</span>
              <span className={trends && trends.water > resourceData.water.target ? 'text-red-600' : 'text-green-600'}>
                {trends && trends.water > resourceData.water.target
                  ? `+${(trends.water - resourceData.water.target).toFixed(1)}L over`
                  : `${(resourceData.water.target - trends.water).toFixed(1)}L under`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: Math.min(100, ((trends?.water || 0) / resourceData.water.target) * 100) + '%',
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm">
              <strong>Monthly Cost:</strong> <span className="text-lg text-blue-600">${costs?.water.toFixed(2) || '--'}</span>
            </p>
          </div>
        </div>

        {/* Electricity Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">⚡ Electricity Usage</p>
              <p className="text-3xl font-bold text-yellow-600">
                {trends?.electricity.toFixed(1) || '--'} {resourceData.electricity.unit}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">7-day average per day</p>
            </div>
            <div className={`text-center p-4 rounded-lg ${getEfficiencyColor(efficiency?.electricity || 0)}`}>
              <p className="text-2xl font-bold">{efficiency?.electricity || '--'}%</p>
              <p className="text-xs">Efficiency</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: {resourceData.electricity.target}kWh/day</span>
              <span
                className={
                  trends && trends.electricity > resourceData.electricity.target ? 'text-red-600' : 'text-green-600'
                }
              >
                {trends && trends.electricity > resourceData.electricity.target
                  ? `+${(trends.electricity - resourceData.electricity.target).toFixed(1)}kWh over`
                  : `${(resourceData.electricity.target - trends.electricity).toFixed(1)}kWh under`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: Math.min(100, ((trends?.electricity || 0) / resourceData.electricity.target) * 100) + '%',
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm">
              <strong>Monthly Cost:</strong> <span className="text-lg text-yellow-600">${costs?.electricity.toFixed(2) || '--'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overall Efficiency */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Overall Efficiency Score</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Based on water and electricity usage trends</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">{efficiency?.overall || '--'}%</div>
            <p className={`font-semibold px-4 py-2 rounded-full ${getEfficiencyColor(efficiency?.overall || 0)}`}>
              {getEfficiencyBadge(efficiency?.overall || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Potential Savings */}
      {savings && savings.total > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">💰 Potential Monthly Savings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">Water Savings</p>
              <p className="text-2xl font-bold text-green-600">${savings.water.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">Electricity Savings</p>
              <p className="text-2xl font-bold text-green-600">${savings.electricity.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Monthly</p>
              <p className="text-2xl font-bold text-green-600">${savings.total.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              That's <strong>{savings.percentageImprovement}%</strong> improvement possible with optimization!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDashboard;
