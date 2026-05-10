import React from 'react';

const AlertBox = ({ alert, onDismiss }) => {
  const severityStyles = {
    critical: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800/50',
      text: 'text-red-900 dark:text-red-200',
      badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800/50',
      text: 'text-amber-900 dark:text-amber-200',
      badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800/50',
      text: 'text-blue-900 dark:text-blue-200',
      badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    },
  };

  const severityIcons = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const severityLabels = {
    critical: 'Critical',
    warning: 'Warning',
    info: 'Info',
  };

  const style = severityStyles[alert.severity] || severityStyles.info;
  const icon = severityIcons[alert.severity] || '❓';
  const label = severityLabels[alert.severity] || 'Alert';

  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-sm transition-all hover:shadow-md ${style.bg} ${style.border}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4 flex-1">
          <span className="text-3xl flex-shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className={`font-bold text-lg ${style.text}`}>{alert.title}</h4>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${style.badge}`}>
                {label}
              </span>
            </div>
            <p className={`text-sm ${style.text} opacity-90 mb-2`}>{alert.message}</p>
            {alert.timestamp && (
              <p className={`text-xs ${style.text} opacity-60`}>
                🕐 {new Date(alert.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors ${style.text} opacity-60 hover:opacity-100`}
            title="Dismiss alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBox;
