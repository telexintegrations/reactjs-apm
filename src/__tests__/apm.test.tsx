import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { FC, useEffect } from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { useAPM } from '../useAPM';
import { APMProvider } from '../APMContext';
import { APM_FLUSH_TIMEOUT } from '../constants';

const defaultEndpoint = 'https://mockserver.com';
const customEndpoint = 'https://mock-custom-server.com';

type TestComponentProps = {
  shouldThrow?: boolean;
};

const TestComponent: FC<TestComponentProps> = ({ shouldThrow }) => {
  const apm = useAPM();

  useEffect(() => {
    if (shouldThrow) throw new Error('Test error');
  }, []);

  return (
    <button
      onClick={() =>
        apm.log({
          endpoint: customEndpoint,
          eventName: 'click',
          message: 'User clicked',
          status: 'success',
        })
      }
    >
      Click Me
    </button>
  );
};

const server = setupServer();

const testTimeout = APM_FLUSH_TIMEOUT + 3000;

jest.setTimeout(testTimeout + 3000);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('APM throws if (useAPM) hook context is used outside the APMProvider', () => {
  expect(() => render(<TestComponent />)).toThrow();
});
test('APMProvider provides context and renders children without errors', () => {
  render(
    <APMProvider
      config={{ projectName: 'React Test', webhook: defaultEndpoint }}
    >
      <TestComponent />
    </APMProvider>
  );

  expect(screen.getByRole('button'));
});
test('APM sends log payload request to the provided endpoint via the useAPM hook', async () => {
  const defaultMockLog = jest.fn();
  const customMockLog = jest.fn();

  server.use(
    http.post(defaultEndpoint, async ({ request }) => {
      const body = await request.json();
      defaultMockLog(body);
      return HttpResponse.json({});
    })
  );
  server.use(
    http.post(customEndpoint, async ({ request }) => {
      const body = await request.json();
      customMockLog(body);
      return HttpResponse.json({});
    })
  );

  render(
    <APMProvider
      config={{ projectName: 'React Test', webhook: defaultEndpoint }}
    >
      <TestComponent />
    </APMProvider>
  );

  fireEvent.click(screen.getByRole('button'));

  await waitFor(
    () => {
      expect(defaultMockLog).toHaveBeenCalledTimes(0);
      expect(customMockLog).toHaveBeenCalledTimes(1);
    },
    {
      timeout: testTimeout,
    }
  );
});
