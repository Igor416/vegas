import React, { useState } from "react";
import { StyleSheet, css } from 'aphrodite';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import { sendForm } from "./APICallPoints.js";
import CustomButton from './CustomButton.js';
import CustomPhoneInput from './CustomPhoneInput.js';
import Hoverable from './Hoverable.js';

const shadowStyles = StyleSheet.create({
  item: {
    boxShadow: '0 .5rem 1rem rgba(0, 0, 0, .15)',
    ':hover': {
      boxShadow: '0 1rem 1.5rem rgba(0, 0, 0, .175)'
    }
  }
})

const itemStyles = StyleSheet.create({
  column: {
    flexFlow: 'row nowrap',
    ':nth-child(1n) > img': {
      width: '40%'
    },
    paddingRight: '4em'
  },
  grid: {
    flexFlow: 'column'
  }
})

export default function Product(props) {
  const product = props.product
  let [error, setError] = useState(false)
  let [name, setName] = useState('')
  let [phone, setPhone] = useState('')
  
  if (!product) {
    return <div className={css(props.isGrid ? itemStyles.grid : itemStyles.column)}></div>
  }
  let price = product.sizes[0]['price' + props.currency];
  let old_price = price;
  if (product.discount) {
    price *= (100 - product.discount) / 100
  }

  let submitForm = () => {
    let r = sendForm({
      'category': props.category.name,
      'product': product.name,
      'name': name,
      'phone': phone
    }, Cookies.get('csrftoken'), true)

    if (r == 'error: empty') {
      setError(true)
    }
    else {
      $(function () {
        $('#modal').modal('toggle');
     });
    }
  }

  const translations = {
    en: {
      from: 'from',
      details: 'More',
      call: 'Order Call',
      error: 'Fill in all the fields!',
      desc: 'You can order a call in which you will be consulted on any questions that arise. Indicate how to contact you, as well as your phone number. After submitting the data to the specified phone number, a call will be received within a minute from a store employee',
      name: 'Your nickname',
      close: 'Close',
      submit: 'Submit'
    },
    ru: {
      from: 'от',
      details: 'Подробнее',
      call: 'Закажите звонок',
      error: 'Заполните все поля!',
      desc: 'Вы можете заказать звонок, в котором вас проконсультируют по любым появивщимся вопросам. Укажите как к вам обращаться, а также свой номер телефона. После отправки данных на указаный номер телефона поступит, в течении минуты звонок, от сотрудника магазина',
      name: 'Ваше имя',
      close: 'Закрыть',
      submit: 'Отправить'
    },
    ro: {
      from: 'de la',
      details: 'Mai mult',
      call: 'Solicitați un apel',
      error: 'Completați toate intrările!',
      desc: 'Puteți comanda un apel în care veți fi consultat cu privire la orice întrebări care apar. Indicați cum să vă contactați, precum și numărul dvs. de telefon. După trimiterea datelor la numărul de telefon specificat, un apel va fi primit într-un minut de la un angajat al magazinului',
      name: 'Numele dumneavoastră',
      close: 'Închide',
      submit: 'Trimite'
    }
  }
  
  let lang_version = translations[props.lang];
  return (
    <div>
      <div className={css(props.isGrid ? itemStyles.grid : itemStyles.column) + ' ' + css(shadowStyles.item) + " d-flex transition no-link p-3"}>
        <img src={product.shortcut}/>
        <div className="d-flex flex-column justify-content-between">
          <div className="d-flex flex-row justify-content-between align-items-end">
            <div className="h5 m-0">
              <Hoverable text={`${props.category.name_s} ${product.name}`} />
            </div>
            <div className="d-flex flex-column text-end">
            {product.discount != 0 && 
              <div style={{textDecoration: 'line-through'}}>
                <span>
                  {`${lang_version.from} ${old_price} (${props.currency})`}
                </span>
              </div>
            }
              <div>
                <span>
                  {`${lang_version.from} `}
                </span>
                <span style={{color: 'var(--lime-green)'}} className="h5">
                  {price}
                </span>
                <span>
                  {` (${props.currency})`}
                </span>
              </div>
            </div>
          </div>
          <div className="py-3 border-bottom border-1 border-muted">
            <div>
              <span>{product.desc}</span>
            </div>
          </div>
          <div className="d-flex mt-4 flex-row row-nowrap justify-content-between h5">
            <Link to={`/product/${props.category.name}/${product.id}` + location.search}>
              <CustomButton color="limeGreen" text={lang_version.details} />
            </Link>
            <div data-bs-toggle="modal" data-bs-target="#modal">
              <CustomButton color="deepSkyBlue" text={lang_version.call} />
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title h5" id="modalLabel">{lang_version.call + ` (${product.name})`}</span>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <span>{lang_version.desc}</span>
              <br/>
              <span className="h6 text-danger">{error ? lang_version.error : ''}</span>
              <form className="mt-3">
                <label htmlFor="name">{lang_version.name}</label>
                <br/>
                <input
                  style={{border: 'none', borderBottom: '1px solid var(--dark-cyan)'}}
                  className="outline-0 no-hover w-100 px-0 mb-3"
                  type="text"
                  name="name"
                  placeholder="..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <CustomPhoneInput
                  lang={props.lang}
                  color="dark-cyan" 
                  value={phone}
                  setPhone={phone => setPhone(phone)}
                />
              </form>
            </div>
            <div className="d-flex justify-content-between modal-footer">
              <div data-bs-dismiss="modal">
                <CustomButton color="limeGreen" text={lang_version.close} />
              </div>
              <div onClick={submitForm}>
                <CustomButton color="deepSkyBlue" text={lang_version.submit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}