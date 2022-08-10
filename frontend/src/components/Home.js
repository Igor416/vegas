import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import { getBanners } from "./reusables/APICallPoints.js";
import LocationListener from "./reusables/LocationListener.js";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.context.lang,
      banners: []
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
    }, () => {
      getBanners().then((data) => {
        this.setState({
          banners: data
        })
      })
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
            {this.state.banners[0] && 
              <div id="carousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-interval="1500">
                <div className="carousel-inner">
                {this.state.banners.map((banner, index) => {
                return (
                  <div key={index} className={"carousel-item " + (index == 0 ? "active" : "")}>
                    <img src={banner} className="d-block w-100" />
                  </div>
                )})}
                </div>
                <button 
                  className="carousel-control-prev h2"
                  style={{width: '5%', color: 'var(--dark-cyan)'}} 
                  data-bs-target="#carousel" 
                  data-bs-slide="prev"
                >
                  <FontAwesomeIcon icon='angle-left' />
                </button>
                <button 
                  className="carousel-control-next h2"
                  style={{width: '5%', color: 'var(--dark-cyan)'}} 
                  data-bs-target="#carousel" 
                  data-bs-slide="next"
                >
                  <FontAwesomeIcon icon='angle-right' />
                </button>
              </div>
              }
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Home);
