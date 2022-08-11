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
      banners: ''
    }

    this.translations = {
      en: {
        is: 'is',
        chars: [['European components', 'lime-green'], ['Extended warranty up to 25 years', 'dark-cyan'], ['Individual sizes', 'deep-sky-blue']],
        title: 'At Vegas, we are experts at sleep',
        desc: 'We believe that good sleep is the foundation of a happy and healthy life, and our dream is that everyone can get their 8 hours of restful sleep.\n\nOur team has developed a wide range of products designed to improve the quality of sleep. Vegas is designed with a visible balance of style and function.'
      },
      ru: {
        is: 'это',
        chars: [['Европейские комплектующие', 'lime-green'], ['Увеличенная гарантия до 25 лет', 'dark-cyan'], ['Индивидуальные размеры', 'deep-sky-blue']],
        title: 'В Vegas у нас есть эксперты по сну',
        desc: 'Мы верим, что хороший сон является основой счастливой и здоровой жизни, и наша мечта состоит в том, чтобы каждый мог получить свои 8 часов спокойного сна.\n\nНаша команда разработала широкий спектр продуктов, предназначенных для улучшения качества сна. Изделие Vegas создано с видимым балансом стиля и функциональности.'
      },
      ro: {
        is: 'este',
        chars: [['Componente europene', 'lime-green'], ['Garanție extinsă până la 25 de ani', 'dark-cyan'], ['Dimensiuni individuale', 'deep-sky-blue']],
        title: 'La Vegas, suntem experți în somn',
        desc: 'Credem că un somn bun este baza unei vieți fericite și sănătoase, iar visul nostru este ca toată lumea să își poată avea cele 8 ore de somn odihnitor.\n\nEchipa noastră a dezvoltat o gamă largă de produse concepute pentru a îmbunătăți calitatea somnului. Vegas este proiectat cu un echilibru vizibil de stil și funcție.'
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
              <div className="col-1"></div>
            </div>
          </div>
          <div className="d-flex row-nowrap py-5 bg-light justify-content-center align-items-center mt-5">
            <img src="/static/images/logo.png"/>
            <span style={{fontWeight: 400}} className="ms-5 h1">{lang_verion.is}</span>
            <div className="row justify-content-between">
            {lang_verion.chars.map((char, index) => {
            return (
              <div
                key={index}
                style={{
                  width: '12.5vw',
                  height: '12.5vw',
                  fontWeight: 400,
                  backgroundColor: `var(--${char[1]})`
                }}
                className="d-flex p-3 ms-5 justify-content-center align-items-center text-center text-white rounded-circle h5"
              >
                <span>{char[0]}</span>
              </div>
            )})}
            </div>
          </div>
          <div className="row text-center mt-5 pt-5">
            <div className="col-3"></div>
            <div className="col-6">
              <p className="h2">{lang_verion.title}</p>
              <br />
              <p style={{fontWeight: 400, whiteSpace: "pre-line"}}>{lang_verion.desc}</p>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Home);
