import { useContext } from 'react';
import { APMContext } from './APMContext';

export const useAPM = () => {
  const context = useContext(APMContext);
  if (!context) {
    throw new Error('useAPM must be used within an APMProvider');
  }
  return context;
};
