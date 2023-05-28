import React, { useEffect } from "react";
import PhoneInput from 'react-phone-input-2';

interface CustomPhoneInput {
  lang: string,
  color: string,
  phone: string,
  setPhone: (phone: string) => void
}

export default function CustomPhoneInput({lang, color, phone, setPhone}: CustomPhoneInput) {
  let lang_version = '';
  if (lang == 'en') {
    lang_version = 'Phone'
  } else if (lang == 'ru') {
    lang_version = 'Телефон'
  } else if (lang == 'ru') {
    lang_version = 'Telefon'
  }

  useEffect(() => {
    let div = document.getElementsByClassName('react-tel-input')[0]
    let label = div.children[0] as HTMLElement
    let input = div.children[1] as HTMLElement
    
    label.innerHTML = lang_version
    input.style.border = 'none'
    input.style.borderBottom = `1px solid var(--${color})`
    input.style.padding = '0 inherit'
    input.classList.forEach(el => input.classList.remove(el))
    input.classList.add('w-100')
    input.classList.add('no-hover')
  }, []);

  return (
    <PhoneInput country={'md'} value={phone} onChange={setPhone} />
  )
}