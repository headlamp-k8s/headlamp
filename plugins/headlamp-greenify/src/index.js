import React from 'react';
import ReactDOM from 'react-dom';

const ReactGreenify = props => {
  const { children, color } = props;
  return (
    <div
      style={{
        backgroundColor: color || "green"
      }}
    >
      {children}
    </div>
  );
};


const Thing = () => <ReactGreenify>meow cat</ReactGreenify>

const initialize = (register) => {
  console.log('headlamp-greenify initialize called');
  register.registerAppBarAction('monitor', () =>
    <Thing />
  );
}

if (window['registerPlugin']) {
  console.log('registerPlugin in greenify called');
  window['registerPlugin']('greenify', {initialize});
}

export { ReactGreenify, initialize };
