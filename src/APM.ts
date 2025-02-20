import { APM_FLUSH_TIMEOUT } from './constants';
import { APMLogPayload, APMQueueItem } from './types';

export class APM {
  private endpoint: string;
  private projectName: string;
  private queue: APMQueueItem[] = [];
  private flushTimeout: number | null = null;

  constructor(config: { endpoint: string; projectName: string }) {
    this.endpoint = config.endpoint;
    this.projectName = config.projectName;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush(true);
      }
    });

    // ✅ Auto-bind `log` so it works when destructured
    this.log = this.log.bind(this);
  }

  log({ endpoint, eventName, message, status }: APMLogPayload) {
    this.queue.push({
      endpoint,
      event_name: eventName,
      message,
      status,
      username: this.projectName,
    });

    if (!this.flushTimeout) {
      this.flushTimeout = window.setTimeout(
        () => this.flush(false),
        APM_FLUSH_TIMEOUT
      );
    }
  }

  private async flush(isNotVisible = false) {
    if (this.queue.length === 0) return;

    while (this.queue.length > 0) {
      const logEntry = this.queue.shift();

      if (!logEntry) continue;
      const { endpoint = this.endpoint, ...rest } = logEntry;
      if (isNotVisible && navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, JSON.stringify(rest));
      } else {
        try {
          await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rest),
          });
        } catch (err) {
          console.error('Telex APM log send failed', err);
        }
      }
    }

    this.flushTimeout = null;
  }
}
