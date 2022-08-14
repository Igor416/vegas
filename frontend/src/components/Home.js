import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getBanners, getReviews, sendReview } from "./reusables/APICallPoints.js";
import LocationListener from "./reusables/LocationListener.js";
import CustomButton from "./reusables/CustomButton.js"

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: this.props.context.lang,
      banners: '',
      reviews: '',
      review: {
        title: '',
        city: '',
        text: ''
      }
    }

    this.translations = {
      en: {
        is: 'is',
        chars: [['European components', 'lime-green'], ['Extended warranty up to 25 years', 'dark-cyan'], ['Individual sizes', 'deep-sky-blue']],
        main: 'At Vegas, we are experts at sleep',
        desc: 'We believe that good sleep is the foundation of a happy and healthy life, and our dream is that everyone can get their 8 hours of restful sleep.\n\nOur team has developed a wide range of products designed to improve the quality of sleep. Vegas is designed with a visible balance of style and function.',
        reviews: 'Reviews',
        leave: 'Leave your review',
        title: 'Title',
        city: 'City',
        text: 'Text'
      },
      ru: {
        is: 'это',
        chars: [['Европейские комплектующие', 'lime-green'], ['Увеличенная гарантия до 25 лет', 'dark-cyan'], ['Индивидуальные размеры', 'deep-sky-blue']],
        main: 'В Vegas - индивидуальный подбор матраса',
        desc: 'Мы верим, что хороший сон является основой счастливой и здоровой жизни, и наша мечта состоит в том, чтобы каждый мог получить свои 8 часов спокойного сна.\n\nНаша команда разработала широкий спектр продуктов, предназначенных для улучшения качества сна. Изделие Vegas создано с видимым балансом стиля и функциональности.',
        reviews: 'Отзывы',
        leave: 'Оставьте свой отзыв',
        title: 'Заголовок',
        city: 'Город',
        text: 'Текст'
      },
      ro: {
        is: 'este',
        chars: [['Componente europene', 'lime-green'], ['Garanție extinsă până la 25 de ani', 'dark-cyan'], ['Dimensiuni individuale', 'deep-sky-blue']],
        main: 'La Vegas, suntem experți în somn',
        desc: 'Credem că un somn bun este baza unei vieți fericite și sănătoase, iar visul nostru este ca toată lumea să își poată avea cele 8 ore de somn odihnitor.\n\nEchipa noastră a dezvoltat o gamă largă de produse concepute pentru a îmbunătăți calitatea somnului. Vegas este proiectat cu un echilibru vizibil de stil și funcție.',
        reviews: 'Recenzii',
        leave: 'Lăsați recenzie dvs',
        title: 'Titlu',
        city: 'Oraș',
        text: 'Text'
      }
    }

    this.updateLang = this.updateLang.bind(this);
    this.submitForm = this.submitForm.bind(this);
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
      getReviews().then((data) => {
        this.setState({
          reviews: data
        })
      })
    })
  }

  updateReview(key, value) {
    let review = this.state.review
    review[key] = value
    this.setState({
      review: review
    })
  }

  submitForm() {
    let today = new Date()
    sendReview(Object.assign({
      date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    }, this.state.review), Cookies.get('csrftoken'))
  }

  render() {
    const lang_verion = this.translations[this.state.lang];

    return (
      <div className="mt-5">
        <LocationListener locationChanged={this.updateLang} />
        <div className="container-fluid text-center mt-5">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
            {this.state.banners != '' && 
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
                className="d-flex p-3 ms-5 justify-content-center align-items-center text-center text-white rounded-circle span"
              >
                <span className="h5">{char[0]}</span>
              </div>
            )})}
            </div>
          </div>
          <div className="row text-center mt-5 pt-5">
            <div className="col-3"></div>
            <div className="col-6">
              <p className="h2">{lang_verion.main}</p>
              <br />
              <p style={{fontWeight: 400, whiteSpace: "pre-line"}}>{lang_verion.desc}</p>
            </div>
            <div className="col-3"></div>
          </div>
          {this.state.reviews != '' && 
          <div className="row mt-5">
            <div className="col-2"></div>
            <div className="col-8">
              <div className="w-100 pt-3 border">
                <span className="h4 border-bottom border-2">{lang_verion.reviews}:</span>
                <div id="carouselReviews" className="p-5 mt-1 carousel slide" data-interval="false">
                  <div className="carousel-indicators">
                    {this.state.reviews.map((_, index) => {
                    return <button
                            key={index}
                            data-bs-target="#carouselReviews"
                            data-bs-slide-to={index}
                            className={(index == 0 ? "active " : "") + "bg-dark"}
                            />
                    })}
                  </div>
                  <div className="carousel-inner">
                  {this.state.reviews.map((review, index) => {
                  return (
                    <div key={index} className={(index == 0 ? "active " : "") + "text-center carousel-item"}>
                      <div className="row position-relative mb-4 text-center h6">
                        <div className="d-flex row-nowrap justify-content-between">
                          <span><FontAwesomeIcon icon='calendar-alt' />&nbsp;{review.date}</span>
                          <span><FontAwesomeIcon icon='map-marker-alt' />&nbsp;{review.city}</span>
                        </div>
                        <span className="h5">{review.title}</span>
                      </div>
                      <span className="w-100">{review.text}</span>
                    </div>
                  )})}
                  </div>
                  <button 
                    className="carousel-control-prev h2"
                    style={{width: '5%', color: 'var(--dark-cyan)'}} 
                    data-bs-target="#carouselReviews" 
                    data-bs-slide="prev"
                  >
                    <FontAwesomeIcon icon='angle-left' />
                  </button>
                  <button 
                    className="carousel-control-next h2"
                    style={{width: '5%', color: 'var(--dark-cyan)'}} 
                    data-bs-target="#carouselReviews" 
                    data-bs-slide="next"
                  >
                    <FontAwesomeIcon icon='angle-right' />
                  </button>
                </div>
              </div>
              <div className="my-5 text-start">
                {Object.keys(this.state.review).map((key, index) => {
                return (
                <div key={index} className="mt-2 d-flex flex-column">
                  <label htmlFor={key} className="h6">{lang_verion[key]}: </label>
                  <input
                    type="text"
                    name={key}
                    value={this.state.review[key]}
                    onChange={(e) => this.updateReview(key, e.target.value)}
                    style={{border: 'none', borderBottom: '1px solid var(--dark-cyan)'}}
                    className="outline-0 no-hover w-100 px-0"
                  />
                </div>
                )})}
                <div className="w-100 d-flex justify-content-end mt-3">
                  <div onClick={this.submitForm}>
                    <CustomButton color="darkCyan" text={lang_verion.leave} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-2"></div>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default withParams(Home);
