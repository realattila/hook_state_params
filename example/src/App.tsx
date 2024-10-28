import React from 'react';
import logo from './logo.svg';
import './App.css';
import useSyncParamsWithState from './src';
function App() {
  useSyncParamsWithState(
    { name: 'apple', id: 2, numArr: [1, 2, 3] },
    {
      id: {
        type: 'number',
        enableParams: true,
        validValues: [1, 2, 3, 5, 6, 7, 8],
      },
      name: { type: 'string', enableParams: true },
      numArr: { type: 'number-array', enableParams: true, },
    },
    { urlUpdateType: 'push', ignoreOtherParams: true }
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
