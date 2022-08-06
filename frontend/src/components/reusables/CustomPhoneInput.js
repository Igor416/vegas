import React, { useEffect } from "react";
import PhoneInput from 'react-phone-input-2';

export default function CustomPhoneInput(props) {
  const translations = {
    en: {
      phone: 'Phone'
    },
    ru: {
      phone: 'Телефон'
    },
    ro: {
      phone: 'Telefon'
    }
  }

  const lang_version = translations[props.lang]

  useEffect(() => {
    let div = document.getElementsByClassName('react-tel-input')[0]
    let label = div.children[0]
    let input = div.children[1]
    
    label.innerHTML = lang_version.phone
    input.style.border = 'none'
    input.style.borderBottom = '1px solid var(--dark-cyan)'
    input.style.padding = '0 inherit'
    input.classList = []
    input.classList.add('w-100')
    input.classList.add('no-hover')
  }, []);

  return (
    <PhoneInput country={'md'} value={props.phone} onChange={phone => props.setPhone(phone)} />
  )
}
