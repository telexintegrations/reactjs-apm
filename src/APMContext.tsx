import React, { createContext, useEffect } from 'react';
import { APM } from './APM';
import { APMProviderProps } from './types';

export const APMContext = createContext<APM | null>(null);

export const APMProvider: React.FC<APMProviderProps> = ({
  children,
  config: { projectName, webhook },
}) => {
  const apm = new APM({ endpoint: webhook, projectName });

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      apm.log({
        eventName: 'Uncaught Exception',
        message: `
          ${event.message}
          --------------------------------------
          Name: ${event.error?.name || '-'}
          --------------------------------------
          Stack: ${event.error?.stack || '-'}
          --------------------------------------
          Timestamp: ${event.timeStamp}
          --------------------------------------
        `,
        status: 'error',
      });
    };
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      const isErrorInstance = event.reason instanceof Error;

      apm.log({
        eventName: 'Unhandled Promise',
        message: `
          Unhandled Promise Rejection: ${
            isErrorInstance ? event.reason.message : event.reason?.toString()
          }
          --------------------------------------
          Name: ${event.reason?.name || '-'}
          --------------------------------------
          Stack: ${event.reason?.stack || '-'}
          --------------------------------------
          Timestamp: ${event.timeStamp}
          --------------------------------------
        `,
        status: 'error',
      });
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  return <APMContext.Provider value={apm}>{children}</APMContext.Provider>;
};
