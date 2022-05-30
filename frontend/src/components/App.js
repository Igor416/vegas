import React, { Component } from "react";
import { createRoot } from 'react-dom/client';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div><h1>Testing Rect Code</h1></div>
    );
  }
}

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(<App />);
