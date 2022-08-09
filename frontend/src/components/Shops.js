import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import LocationListener from "./reusables/LocationListener.js";
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

    this.state = {
      lang: this.props.context.lang
    }

    this.translations = {
      en: {
        opened: 'Opened',
        closed: 'Closed',
        workday: 'Monday - Friday: ',
        weekend: 'Saturday - Sunday: '
      },
      ru: {
        opened: 'Открыто',
        closed: 'Закрыто',
        workday: 'Понедельник - Пятница: ',
        weekend: 'Суббота - Воскресенье: '
      },
      ro: {
        opened: 'Deschis',
        closed: 'Închis',
        workday: 'Luni - Vineri: ',
        weekend: 'Sâmbătă - Duminică: '
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

  isOpen() {
    let today = new Date()
    let hours = today.getHours()
    if ((today.getDay() % 6)) {
      return 10 < hours && hours < 19
    }
    else {
      if (hours == 19) {
        return today.getMinutes() < 31
      }
      return 10 < hours && hours < 20
    }
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
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=1GchRIsF2ZGYvS6rskNj_6UTPwg1UB6w&ehbc=2E312F"
              className="w-100"
              style={{height: '100vh'}}
            />
            <div className="d-flex flex-wrap justify-content-between mt-5">
            {Object.keys(shops).map((name, index) => {
            return (
              <div key={index} className={css(shadowStyles.item) + " col-5 bg-white transition-s p-5 my-5 h6"}>
                <span style={{color: 'var(--lime-green'}} className="h5 mb-4">{name}</span>
                <span>&nbsp; ({this.isOpen() ? lang_verion.opened : lang_verion.closed})</span>
                <br />
                <br />
                <FontAwesomeIcon icon='map-marker-alt' />
                <span className="mb-4">&nbsp; {shops[name][0]}</span>
                <br />
                <br />
                <span>{lang_verion.workday}</span>
                <span style={{color: 'var(--lime-green'}} className="mb-4">10.00 - 19.30</span>
                <br />
                <br />
                <span>{lang_verion.weekend}</span>
                <span style={{color: 'var(--lime-green'}} className="mb-4">10.00 - 18.00</span>
                <br />
                <br />
                <FontAwesomeIcon icon='phone' />
                <span style={{color: 'var(--lime-green'}}>&nbsp; {shops[name][1]}</span>
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

export default withParams(Shops);
