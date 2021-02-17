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
  console.log('headlamp-greenify'); // register.registerAppBarAction('monitor', () =>
  //   <Thing />
  // );
};

exports.initialize = initialize;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdEdyZWVuaWZ5IiwicHJvcHMiLCJjaGlsZHJlbiIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiVGhpbmciLCJpbml0aWFsaXplIiwicmVnaXN0ZXIiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVBLE1BQU1BLGFBQWEsR0FBR0MsS0FBSyxJQUFJO0FBQzdCLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQTtBQUFaLE1BQXNCRixLQUE1QjtBQUNBLHNCQUNFO0FBQ0UsSUFBQSxLQUFLLEVBQUU7QUFDTEcsTUFBQUEsZUFBZSxFQUFFRCxLQUFLLElBQUk7QUFEckIsS0FEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBS0dELFFBTEgsQ0FERjtBQVNELENBWEQ7Ozs7QUFjQSxNQUFNRyxLQUFLLEdBQUcsbUJBQU0sNkJBQUMsYUFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBQXBCOztBQUVBLE1BQU1DLFVBQVUsR0FBSUMsUUFBRCxJQUFjO0FBQy9CQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxtQkFBWixFQUQrQixDQUcvQjtBQUNBO0FBQ0E7QUFDRCxDQU5EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuXG5jb25zdCBSZWFjdEdyZWVuaWZ5ID0gcHJvcHMgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjb2xvciB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvciB8fCBcImdyZWVuXCJcbiAgICAgIH19XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuXG5jb25zdCBUaGluZyA9ICgpID0+IDxSZWFjdEdyZWVuaWZ5Pm1lb3cgY2F0PC9SZWFjdEdyZWVuaWZ5PlxuXG5jb25zdCBpbml0aWFsaXplID0gKHJlZ2lzdGVyKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdoZWFkbGFtcC1ncmVlbmlmeScpO1xuXG4gIC8vIHJlZ2lzdGVyLnJlZ2lzdGVyQXBwQmFyQWN0aW9uKCdtb25pdG9yJywgKCkgPT5cbiAgLy8gICA8VGhpbmcgLz5cbiAgLy8gKTtcbn1cblxuZXhwb3J0IHsgUmVhY3RHcmVlbmlmeSwgaW5pdGlhbGl6ZSB9O1xuIl19