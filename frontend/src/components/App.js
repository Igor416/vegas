import React, { Component } from "react";
import Header from "./Header.js"
import { createRoot } from 'react-dom/client';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header></Header>
    );
  }
}

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(<App />);
