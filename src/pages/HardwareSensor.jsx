import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import HardwareSensorDashboard from '../components/HardwareSensorDashboard';

const HardwareSensor = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{t('hardwareSensor')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('hardwareSensorDescription')}</p>
      </div>

      <HardwareSensorDashboard />
    </div>
  );
};

export default HardwareSensor;