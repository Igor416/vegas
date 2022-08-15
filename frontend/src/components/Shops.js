import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import { withTranslation } from "react-i18next";
import { Shops as shops } from "./reusables/Globals";

const shadowStyles = StyleSheet.create({
  item: {
    boxShadow: '0 .5rem 1rem rgba(0, 0, 0, .15)',
    ':hover': {
      boxShadow: '0 1rem 1.5rem rgba(0, 0, 0, .175)'
    }
  }
})

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Shops extends Component {
  constructor(props) {
    super(props);
  }

  isOpen() {
    let today = new Date()
    let hours = today.getHours()
    if ((today.getDay() % 6)) {
      return (9 < hours) && (hours < 19)
    }
    else {
      if (hours == 19) {
        return today.getMinutes() < 31
      }
      return (9 < hours) && (hours < 19)
    }
  }

  render() {
    const t = this.props.t
    return (
      <div className="mt-5">
        <div className="container-fluid mt-5">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=1GchRIsF2ZGYvS6rskNj_6UTPwg1UB6w&ehbc=2E312F"
              className="w-100"
              style={{height: '100vh'}}
            />
            <div className="d-flex flex-wrap justify-content-between mt-5">
            {Object.keys(shops).map((name, index) => {
            return (
              <div key={index} className={css(shadowStyles.item) + " col-5 bg-white transition p-5 my-5 h6"}>
                <span style={{color: 'var(--dark-cyan)'}} className="h5 mb-4">{name}</span>
                <span>&nbsp; ({this.isOpen() ? t('opened') : t('closed')})</span>
                <br />
                <br />
                <FontAwesomeIcon icon='map-marker-alt' />
                <span className="mb-4">&nbsp; {shops[name][0]}</span>
                <br />
                <br />
                <span>{t('workday')}</span>
                <span style={{color: 'var(--dark-cyan)'}} className="mb-4">10.00 - 19.30</span>
                <br />
                <br />
                <span>{t('weekday')}</span>
                <span style={{color: 'var(--dark-cyan)'}} className="mb-4">10.00 - 18.00</span>
                <br />
                <br />
                <FontAwesomeIcon icon='phone' />
                <span style={{color: 'var(--dark-cyan)'}}>&nbsp; {shops[name][1]}</span>
              </div>
            )})}
            </div>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('shops')(withParams(Shops));
