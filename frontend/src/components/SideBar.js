import React, { Component } from "react";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="offcanvas offcanvas-end" id="sideBar">
        <div className="offcanvas-header">
          <h3 className="offcanvas-title">Корзина</h3>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body mx-4 border-1 border-top border-light">

        </div>
      </div>
    );
  }
}
