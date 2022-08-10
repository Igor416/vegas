import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import LocationListener from "./reusables/LocationListener.js";


function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.context.lang
    }

    this.translations = {
      en: {
      },
      ru: {
      },
      ro: {
      }
    }

    this.updateLang = this.updateLang.bind(this);
  }

  updateLang(path) {
    let lang = path.search.replace('?lang=', '');

    this.setState({
      lang: lang
    })
  }

  render() {
    const lang_verion = this.translations[this.state.lang];

    return (
      <div className="mt-5">
        <LocationListener locationChanged={this.updateLang} />
        <div className="container-fluid mt-5">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
              <span className="h1">Home</span>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Home);
