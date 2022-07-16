import React, { Component, useContext } from "react";
import { useLocation } from 'react-router';

function withParams(Component) {
  return props => <Component {...props} location={useLocation()} />;
}

class SectionImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: ''
    }
  }

  componentDidMount() {
    this.location = this.getLocation()
    console.log(this.location)
  }

  componentDidUpdate() {
    this.location = this.getLocation()
    console.log(this.location)
  }

  getLocation() {
    return this.props.location.pathname.slice(1).split('/') //slice first '/' (slash)
  }

  render() {
    return (
      <div className="container-fluid">
        <div>

        </div>
      </div>
    );
  }
}

export default withParams(SectionImage);