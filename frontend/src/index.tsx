import * as buffer from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
  let alreadyWarned = false;
  let axe = require('@axe-core/react');
  if (axe.default) {
    axe = axe.default; //changed to esm module sometimes?
  }
  const axeCore = require('axe-core');
  // Buffer class is not polyffiled with CRA(v5) so we manually do it here
  window.Buffer = buffer.Buffer;

  if (process.env.REACT_APP_SKIP_A11Y !== 'true') {
    axe(React, ReactDOM, 500, undefined, undefined, (results: typeof axeCore.AxeResults) => {
      if (results.violations.length > 0) {
        console.error('axe results', results);
        if (!alreadyWarned) {
          alreadyWarned = true;
          alert(
            'Accessibility issues found. See developer console. ' +
              '`REACT_APP_SKIP_A11Y=true make run-frontend` to disable alert.'
          );
        }
      }
    }).then(() => {
      // Show the logs at end of other console logs (and after the alert).
      // So they are easier to read.
      axe(React, ReactDOM, 500, { disableDeduplicate: true });
    });
  } else {
    // Only show the logs.
    axe(React, ReactDOM, 500);
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
