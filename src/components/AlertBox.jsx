import React from 'react';

const AlertBox = ({ alert, onDismiss }) => {
  const severityStyles = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const severityIcons = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const style = severityStyles[alert.severity] || severityStyles.info;
  const icon = severityIcons[alert.severity] || '❓';

  return (
    <div className={`border-l-4 p-4 mb-3 rounded ${style}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <h4 className="font-bold">{alert.title}</h4>
            <p className="text-sm">{alert.message}</p>
            {alert.timestamp && (
              <p className="text-xs opacity-75 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-lg opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBox;
