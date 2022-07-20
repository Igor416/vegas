import React, { Component } from "react";

export default class SectionImage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="container-fluid m-0 d-flex flex-column justify-content-around align-items-center"
        style={{
          backgroundImage: `url(/static/images/${this.props.category.name}.jpg)`,
          height: '100vh'
        }}>
        <div className="container" style={{height: '30vh'}}></div>
        <div
          className="container bg-light text-dark d-flex flex-column justify-content-center align-items-center"
          style={{
            opacity: 0.7,
            height: '30vh'
          }}>
          <span className="h4">{this.props.category.name_pl}</span>
          <span className="text-center">{this.props.category.desc}</span>
        </div>
      </div>
    );
  }
}