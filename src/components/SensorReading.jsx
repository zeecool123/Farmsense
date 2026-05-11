import React from 'react';

const SensorReading = ({ label, value, unit, icon, status }) => {
  const getStatusStyles = (currentStatus) => {
    switch (currentStatus) {
      case 'optimal':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
        };
      case 'anomaly':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-700 dark:text-red-400',
          badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div className={`glass-card p-6 text-center group hover:shadow-lg transition-all duration-300 ${styles.bg}`}>
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${styles.text} mb-3`}>
        {value}
        <span className="text-sm ml-1 font-semibold">{unit}</span>
      </p>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles.badge} capitalize`}>
        {status === 'optimal' ? '✓ Optimal' : status === 'anomaly' ? '⚠ Anomaly' : 'ℹ Info'}
      </span>
    </div>
  );
};

export default SensorReading;
