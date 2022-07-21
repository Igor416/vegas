import React, { Component } from "react";
import CustomLink from '../reusables/CustomLink.js';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sub_category: null
    };
  }

  onMouseEnter(sub_category) {
    this.setState({
      sub_category: sub_category
    })
  }

  onMouseLeave() {
    this.setState({
      sub_category: null
    })
  }

  render() {
    let categories = this.props.categories
    
    let get_link = (sub_category) => {
      if (categories[sub_category].length == 0) {
        return '/catalog/' + sub_category.split(';')[1]
      }
      return ''
    }
    return (
      <div
        onMouseEnter={() => this.props.updateInMenu(true)}
        onMouseLeave={() => this.props.updateInMenu()}
        className="row"
      >
        <div className="col-2"></div>
        {this.props.category &&
        <div
          className="col-4 row"
        >
          <div className="col-6 border-start border-light border-2">
            {Object.keys(categories).map((sub_category, index) => {
            return (
              <div
                className="d-flex pb-2"
                key={index}
                onMouseEnter={() => this.onMouseEnter(sub_category)}
              >
                <CustomLink link={get_link(sub_category)} text={sub_category.split(';')[0]} />
              </div>
            )})}
          </div>
          {this.state.sub_category &&
            <div className="col-6 border-start border-light border-2">
            {categories[this.state.sub_category].map((link, index) => {
            return (
              <div
                className="d-flex pb-2"
                key={index}
              >
                <CustomLink link={get_link(this.state.sub_category)} text={link} menu_link={true} />
              </div>
            )})}
          </div>
          }
        </div>
        }
        <div className="col-2 border-start border-light border-2">
        </div>
        <div className="col-2 border-start border-light border-2">
        </div>
        <div className="col-2 border-start border-light border-2"></div>
      </div>
    );
  }
}
