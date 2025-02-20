# Telex ReactJs APM 📊

[![npm version](https://img.shields.io/npm/v/telex-reactjs-apm)](https://www.npmjs.com/package/telex-reactjs-apm)

A lightweight **Application Performance Monitoring (APM) tool** for React apps. It captures errors, logs important events, and sends them to a remote server without blocking the main thread.

## 🚀 Features

- Captures **Uncaught exceptions and unhandled promise rejections** globally.
- Logs **custom events** like user actions.
- **Non-blocking architecture** using async tasks.
- Simple **React Provider API** for easy integration.

---

## 📦 Installation

Install the package using **npm** or **yarn**:

```sh
npm install telex-reactjs-apm
# or
yarn add telex-reactjs-apm
```

## 🛠️ Setup

Wrap your application with the APMProvider in index.(jsx|tsx) or App.(jsx|tsx).

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { APMProvider } from "telex-reactjs-apm";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <APMProvider
    config={{
        endpoint: "https://yourtelexchannelwebhook.com";
        projectName: "Channel chat sender name"
    }}
  >
    <App />
  </APMProvider>
);
```

## 📝 Logging Custom Events

Use useAPM() inside any component to log custom events.

```jsx
import { useAPM } from 'telex-reactjs-apm';

const MyComponent = () => {
  const { log } = useAPM();

  const handleClick = () => {
    log({
      endpoint: 'webhook to optionally send to a different channel',
      eventName: 'button_click',
      message: 'User clicked the button',
      status: 'error' | 'success',
    });
  };

  return <button onClick={handleClick}>Log Event</button>;
};

export default MyComponent;
```
## Demo

https://github.com/user-attachments/assets/ffc60a7a-9272-45c8-af1f-07bc5a0dd90c


## Testing

- Clone the repository

```bash
git clone https://github.com/telexintegrations/reactjs-apm.git
```

- Run yarn install

```bash
yarn install
```

- Run tests locally

```bash
yarn test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
