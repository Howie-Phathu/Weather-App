import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  getDisplayUnit: () => string;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};

interface TemperatureProviderProps {
  children: ReactNode;
}

export const TemperatureProvider: React.FC<TemperatureProviderProps> = ({ children }) => {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const getDisplayUnit = () => {
    return unit === 'celsius' ? '°C' : '°F';
  };

  const value = {
    unit,
    toggleUnit,
    getDisplayUnit,
  };

  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
};
