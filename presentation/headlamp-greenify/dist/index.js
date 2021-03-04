"use strict";

var _interopRequireDefault = require("/home/rene/dev/kinvolk/headlamp/presentation/headlamp-greenify/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = exports.ReactGreenify = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _jsxFileName = "/home/rene/dev/kinvolk/headlamp/presentation/headlamp-greenify/src/index.js";

const ReactGreenify = props => {
  const {
    children,
    color
  } = props;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      backgroundColor: color || "green"
    },
    __self: void 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 5
    }
  }, children);
};

exports.ReactGreenify = ReactGreenify;

const Thing = () => /*#__PURE__*/_react.default.createElement(ReactGreenify, {
  __self: void 0,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 18,
    columnNumber: 21
  }
}, "meow cat");

const initialize = register => {
  console.log('headlamp-greenify');
  register.registerAppBarAction('monitor', () => /*#__PURE__*/_react.default.createElement(Thing, {
    __self: void 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24,
      columnNumber: 5
    }
  }));
};

exports.initialize = initialize;

if (window['registerPlugin']) {
  console.log('zxcvzxcv');
  window['registerPlugin']('greenify', {
    initialize
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdEdyZWVuaWZ5IiwicHJvcHMiLCJjaGlsZHJlbiIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiVGhpbmciLCJpbml0aWFsaXplIiwicmVnaXN0ZXIiLCJjb25zb2xlIiwibG9nIiwicmVnaXN0ZXJBcHBCYXJBY3Rpb24iLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUEsTUFBTUEsYUFBYSxHQUFHQyxLQUFLLElBQUk7QUFDN0IsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBO0FBQVosTUFBc0JGLEtBQTVCO0FBQ0Esc0JBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRTtBQUNMRyxNQUFBQSxlQUFlLEVBQUVELEtBQUssSUFBSTtBQURyQixLQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FLR0QsUUFMSCxDQURGO0FBU0QsQ0FYRDs7OztBQWNBLE1BQU1HLEtBQUssR0FBRyxtQkFBTSw2QkFBQyxhQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FBcEI7O0FBRUEsTUFBTUMsVUFBVSxHQUFJQyxRQUFELElBQWM7QUFDL0JDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG1CQUFaO0FBRUFGLEVBQUFBLFFBQVEsQ0FBQ0csb0JBQVQsQ0FBOEIsU0FBOUIsRUFBeUMsbUJBQ3ZDLDZCQUFDLEtBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQURGO0FBR0QsQ0FORDs7OztBQVFBLElBQUlDLE1BQU0sQ0FBQyxnQkFBRCxDQUFWLEVBQThCO0FBQzVCSCxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxVQUFaO0FBQ0FFLEVBQUFBLE1BQU0sQ0FBQyxnQkFBRCxDQUFOLENBQXlCLFVBQXpCLEVBQXFDO0FBQUNMLElBQUFBO0FBQUQsR0FBckM7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcblxuY29uc3QgUmVhY3RHcmVlbmlmeSA9IHByb3BzID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY29sb3IgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IgfHwgXCJncmVlblwiXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblxuY29uc3QgVGhpbmcgPSAoKSA9PiA8UmVhY3RHcmVlbmlmeT5tZW93IGNhdDwvUmVhY3RHcmVlbmlmeT5cblxuY29uc3QgaW5pdGlhbGl6ZSA9IChyZWdpc3RlcikgPT4ge1xuICBjb25zb2xlLmxvZygnaGVhZGxhbXAtZ3JlZW5pZnknKTtcblxuICByZWdpc3Rlci5yZWdpc3RlckFwcEJhckFjdGlvbignbW9uaXRvcicsICgpID0+XG4gICAgPFRoaW5nIC8+XG4gICk7XG59XG5cbmlmICh3aW5kb3dbJ3JlZ2lzdGVyUGx1Z2luJ10pIHtcbiAgY29uc29sZS5sb2coJ3p4Y3Z6eGN2Jyk7XG4gIHdpbmRvd1sncmVnaXN0ZXJQbHVnaW4nXSgnZ3JlZW5pZnknLCB7aW5pdGlhbGl6ZX0pO1xufVxuXG5leHBvcnQgeyBSZWFjdEdyZWVuaWZ5LCBpbml0aWFsaXplIH07XG4iXX0=