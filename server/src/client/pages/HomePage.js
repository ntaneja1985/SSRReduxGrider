import React from 'react';
const Home = () => {
  return (<div>
    <div>I am the bestestest home component</div>
    <button onClick={() => {console.log('clicked!')}}>Click me</button>
  </div>)
};
export default {
  component: Home,
};