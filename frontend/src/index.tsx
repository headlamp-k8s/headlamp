import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
  let alreadyWarned = false;
  let axe = require('@axe-core/react');
  if (axe.default) {
    axe = axe.default; //changed to esm module sometimes?
  }
  const axeCore = require('axe-core');

  if (process.env.REACT_APP_SKIP_A11Y === 'false') {
    function filterFalsePositives(results: typeof axeCore.AxeResults) {
      // React changes the dom quickly, but axe-core notices missing main in between rendering
      results.violations = results.violations.filter((v: any) => v.id !== 'landmark-one-main');

      // Monaco has an issue with duplicate status.
      // Apparently they've tested it's not an issue in practice.
      // https://github.com/microsoft/monaco-editor/issues/2448
      results.violations = results.violations.filter(
        (v: any) => !(v.id === 'landmark-unique' && v.nodes[0].html.indexOf('monaco-status') !== -1)
      );

      // tooltips have role="tooltip", but should be in a landmark.
      //  This would need to be fixed within Material UI ToolTip component.
      results.violations = results.violations.filter(
        (v: any) => !(v.id === 'region' && v.nodes[0].html.indexOf('role="tooltip"') !== -1)
      );

      // Tooltips do an opacity transition, which causes a color contrast issue.
      // But it's not an issue in practice, because the animation is quick.
      // The final tooltip contrast is fine.
      results.violations = results.violations.filter(
        (v: any) =>
          !(v.id === 'color-contrast' && v.nodes[0].html.indexOf('MuiTooltip-tooltip') !== -1)
      );

      return results;
    }
    axe(React, ReactDOM, 500, undefined, undefined, (results: typeof axeCore.AxeResults) => {
      const filteredResults = filterFalsePositives(results);

      if (filteredResults.violations.length > 0) {
        console.error('axe results', filteredResults);
        if (!alreadyWarned) {
          alreadyWarned = true;
          alert(
            'Accessibility issues found. See developer console. ' +
              '`REACT_APP_SKIP_A11Y=false make run-frontend` to enable alert.'
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
