import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import LocationListener from "./reusables/LocationListener.js";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Shops extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.context.lang,
      shop: null
    }

    this.updateLang = this.updateLang.bind(this);
  }

  updateLang(path) {
    let lang = path.search.replace('?lang=', '');
    let [_, shop] = path.pathname.slice(1).split('/') //['shops', '<shop>']

    this.setState({
      lang: lang,
      shops: shop
    })
  }

  render() {
    return (
      <div>
        <LocationListener locationChanged={this.updateLang} />
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
              {this.state.name && 
              <div></div>
              }
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Shops);
