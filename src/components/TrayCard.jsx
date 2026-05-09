import React from 'react';
import { getScoreColor, getHealthStatus } from '../utils/helpers';

const TrayCard = ({ trayId, crop, aiScore, status, onClick }) => {
  const scoreColor = getScoreColor(aiScore || 0);
  const healthStatus = getHealthStatus(aiScore || 0);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition transform hover:scale-105"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">Tray {trayId}</h3>
          <p className="text-gray-600">{crop?.name || 'Unassigned'}</p>
        </div>
        <span className="text-3xl">{crop?.icon || '❓'}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">AI Score</span>
          <span className="text-lg font-bold" style={{ color: scoreColor }}>
            {aiScore || 0}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${aiScore || 0}%`, backgroundColor: scoreColor }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{ backgroundColor: scoreColor + '20', color: scoreColor }}
        >
          {healthStatus}
        </span>
        <span className={`text-xs font-semibold ${status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'online' ? '🟢 Online' : '🔴 Offline'}
        </span>
      </div>
    </div>
  );
};

export default TrayCard;
