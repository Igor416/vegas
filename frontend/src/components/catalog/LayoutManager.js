import React, { Component } from "react";
import MattrassLayout from "./layouts/MattrassLayout.js";

export default class LayoutManager extends Component {
  constructor(props) {
    super(props);
  }

  components = {
    Mattrass: MattrassLayout
  };
  render() {
    const LayoutName = this.components[this.props.category];
    return <LayoutName products={this.props.products} isGrid={this.props.isGrid}/>
  }
}