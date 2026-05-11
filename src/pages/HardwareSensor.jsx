import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import HardwareSensorDashboard from '../components/HardwareSensorDashboard';

const HardwareSensor = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('hardwareSensorSection')}</h1>
      <HardwareSensorDashboard />
    </div>
  );
};

export default HardwareSensor;
