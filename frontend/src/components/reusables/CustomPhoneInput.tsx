import PhoneInput from 'react-phone-input-2';

interface CustomPhoneInput {
  lang: string,
  color: string,
  phone: string,
  setPhone: (phone: string) => void
}

export function CustomPhoneInput({lang, color, phone, setPhone}: CustomPhoneInput) {
  let lang_version = '';
  if (lang === 'en') {
    lang_version = 'Phone'
  } else if (lang === 'ru') {
    lang_version = 'Телефон'
  } else if (lang === 'ro') {
    lang_version = 'Telefon'
  }

  return <PhoneInput country='md' value={phone} onChange={setPhone} specialLabel={lang_version} inputProps={{
    name: 'phone',
    required: true,
    style: {border: 'none', borderBottom: `1px solid var(--${color})`},
    className: 'w-100 no-hover'
  }} />
}