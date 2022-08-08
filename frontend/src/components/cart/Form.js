import React, { useState } from "react";
import { StyleSheet, css } from 'aphrodite';
import CustomPhoneInput from "../reusables/CustomPhoneInput.js";
import CustomButton from "../reusables/CustomButton.js";

const button = {
  border: '1px solid var(--deep-sky-blue)'
}

const buttonStyles = StyleSheet.create({
  active: Object.assign({
    color: 'white',
    backgroundColor: 'var(--deep-sky-blue)'
  }, button),
  unactive: Object.assign({
    color: 'var(--dark)',
    backgroundColor: 'white'
  }, button)
})

export default function Form(props) {
  const [data, setData] = useState({
    name: '',
    town: '',
    address: '',
    phone: '',
    payment: '',
    courier: true
  })

  const translations = {
    en: {
      error: 'Fill in all the fields!',
      name: 'Your full name',
      town: 'Your city / locality',
      address: 'Address',
      payment: ['By card to the company account', 'By card to the terminal', 'By cash'],
      courier: 'By courier',
      pickup: 'Pickup',
      submit: 'Checkout'
    },
    ru: {
      error: 'Заполните все поля!',
      name: 'Ваше ФИО',
      town: 'Ваш город / населенный пункт',
      address: 'Адрес',
      payment: ['Картой на счет компании', 'Картой на терминал', 'Наличными'],
      courier: 'Курьером',
      pickup: 'Самовывоз',
      submit: 'Оформить заказ'
    },
    ro: {
      error: 'Completați toate intrările!',
      name: 'Numele dumneavoastră',
      town: 'Orașul/localitatea dumneavoastră',
      address: 'Аbordare',
      payment: ['Cu cardul în contul companiei', 'Cu cardul la terminal', 'Bani lichizi'],
      courier: 'Prin curier',
      pickup: 'Ridica',
      submit: 'Face o comandă'
    }
  }

  const fields = ['name', 'town', 'address']

  let updateData = (key, value) => {
    let changedData = {...data}
    changedData[key] = value
    setData(changedData);
  }

  const lang_version = translations[props.lang]
  
  return (
    <div style={{border: '1px solid var(--deep-sky-blue)'}} className="d-flex flex-column mt-5 p-5">
      <span className="h6 text-danger">{props.error ? lang_version.error : ''}</span>
      <div className="row">
        <div className="d-flex col-5 flex-column">
          <div>
          {fields.map((field, index) => {
          if (field != 'payment') {
          return(
            <div key={index}>
              <label htmlFor={field}>{lang_version[field]}</label>
              <input
                name={field}
                value={data[field]}
                onChange={e => updateData(field, e.target.value)}
                type="text"
                style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
                className="outline-0 no-hover w-100 px-0 mb-3 col-12"
              />
            </div>
          )}})}
          <CustomPhoneInput lang={props.lang} color='lime-green' phone={data.phone} setPhone={phone => updateData('phone', phone)} />
          </div>
        </div>
        <div className="col-1"></div>
        <div className="d-flex flex-column col-3">
        {lang_version.payment.map((type, index) => {
        return (
          <div
            key={index}
            className="d-flex justify-content-start row-nowrap mb-3"
            style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
          >
            <input
              name='payment'
              value={type}
              className="me-3"
              onClick={() => {updateData('payment', type)}}
              type="radio"
            />
            <label htmlFor='payment'>{type}</label>
          </div>
        )})}
        </div>
        <div className="d-flex row-nowrap justify-content-end align-items-start col-3">
          <div
            onClick={() => updateData('courier', true)}
            style={{borderRight: 'none'}}
            className={css(data.courier ? buttonStyles.active : buttonStyles.unactive) + " p-3 transition-s"}
          >
            <span>{lang_version.courier}</span>
          </div>
          <div
            onClick={() => updateData('courier', false)}
            style={{borderLeft: 'none'}}
            className={css(!data.courier ? buttonStyles.active : buttonStyles.unactive) + " p-3 transition-s"}
          >
            <span>{lang_version.pickup}</span>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end" onClick={() => props.submitForm(data)}>
        <CustomButton color="deepSkyBlue" text={lang_version.submit} />
      </div>
    </div>
  );
}


