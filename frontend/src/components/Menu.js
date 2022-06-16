import React, { Component } from "react";

export default class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <menu className="container-fluid row px-5 py-2 mt-3">
        <div className="col-1"></div>
        <div className="col-10 h6">
          <div className="d-flex flex-inline justify-content-between">
            <div>
              <span>ГЛАВНАЯ &nbsp;</span>
            </div>
            <div>
              <span>МАТРАСЫ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
            <div>
              <span>ПОДУШКИ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
            <div>
              <span>НАМАТРАСНИКИ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
            <div>
              <span>АКСЕССУАРЫ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
            <div>
              <span>ДЕТЯМ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
            <div>
              <span>МЕБЕЛЬ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
            <div>
              <span>ОСНОВАНИЯ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
            <div>
              <span>МАГАЗИНЫ &nbsp; <i className="far fa-angle-down"></i></span>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </menu>
    );
  }
}
