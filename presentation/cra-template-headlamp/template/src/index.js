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
  console.log('headlamp-greenify');

  // register.registerAppBarAction('monitor', () =>
  //   <Thing />
  // );
}

export { ReactGreenify, initialize };
