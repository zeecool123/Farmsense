import React, { useEffect, useState } from 'react';
import ResourceDashboard from '../components/ResourceDashboard';
import AutomationCenter from '../components/AutomationCenter';
import WasteAlerts from '../components/WasteAlerts';
import { useApp } from '../context/AppContext';

export default function SmartOptimization() {
  const [activeTab, setActiveTab] = useState('overview');
  const { areas, sensorData, sensorHistory } = useApp();
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    const areaIds = Object.keys(areas);
    if (!selectedArea && areaIds.length > 0) {
      setSelectedArea(areaIds[0]);
    }
  }, [areas, selectedArea]);

  const areaData = selectedArea ? sensorData[selectedArea] : null;
  const history = selectedArea ? sensorHistory[selectedArea] || [] : [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🌱 Smart Optimization</h1>
      
      <div className="flex gap-4 mb-8 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'border-b-2 border-blue-600 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}
        >
          📊 Resource Overview
        </button>
        <button
          onClick={() => setActiveTab('automation')}
          className={activeTab === 'automation' ? 'border-b-2 border-blue-600 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}
        >
          ⚙️ Automation
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={activeTab === 'alerts' ? 'border-b-2 border-blue-600 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}
        >
          🚨 Waste Detection
        </button>
      </div>

      <div className="bg-white rounded-lg p-6">
        {activeTab === 'overview' && <ResourceDashboard />}
        {activeTab === 'automation' && <AutomationCenter />}
        {activeTab === 'alerts' && (
          <WasteAlerts areaData={areaData} sensorHistory={areaData?.sensorHistory || []} />
        )}
      </div>
    </div>
  );
}