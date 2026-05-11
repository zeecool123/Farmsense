import React from 'react';

const SensorReading = ({ label, value, unit, icon, status }) => {
  const statusColor = status === 'optimal' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${statusColor}`}>
        {value}
        <span className="text-sm ml-1 font-semibold">{unit}</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">{status}</p>
    </div>
  );
};

export default SensorReading;
