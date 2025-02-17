import { ReactNode } from 'react';

export type APMStatus = 'error' | 'success';

export type APMLogPayload = {
  endpoint?: string;
  eventName: string;
  message: string;
  status: APMStatus;
};

export type APMProviderProps = {
  children: ReactNode;
  config: { projectName: string; webhook: string };
};

export type APMQueueItem = {
  endpoint?: string;
  event_name: string;
  message: string;
  status: APMStatus;
  username: string;
};
