import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { TranslatableProps } from "../../..";
import { useTotal } from "../../../hooks";
import { useContext } from "react";
import { CartContext, CurrencyContext } from "../../../providers";
import { SearchBar, langs } from "../supplies";

export function TopBar({t, i18n}: TranslatableProps) {
  const currency = useContext(CurrencyContext)
  const products = useContext(CartContext)
  const total = useTotal(products, currency)

  return <div className='container-fluid d-flex align-items-center row px-5 pt-4'>
    <div className='col-1'></div>
    <div className='col-1'>
      <Link to='/'>
        <img style={{ maxWidth: '80%' }} src='/static/images/logo.png'/>
      </Link>
    </div>
    <div id='searchBar' className='col-3 ps-0'>
      <SearchBar width={String(document.getElementById('searchBar')?.offsetWidth)} />
    </div>
    <div className='col-1 d-flex flex-column align-items-center'>
    {i18n && langs.filter((lang) => lang != i18n.language).map((lang, i) => <button
      key={i}
      onClick={() => i18n.changeLanguage(lang)}
      className='p-2 bg-white border-0 outline-0 no-hover'
    >
      <img className='border' style={{ width: '2.5vw' }} src={'/static/images/flags/' + lang + '.png'}/>
    </button>)}
    </div>
    <div className='col-2 text-center border-start border-end'>
      <FontAwesomeIcon icon='phone' />
      <br/>
      <span className='h6'>{t('order')}: <br/>079 40-70-32</span>
    </div>
    <div className='col-2 text-center border-end' data-bs-toggle='modal' data-bs-target='#modalHelp'>
      <FontAwesomeIcon icon='hand-holding-usd' />
      <br/>
      <span className='h6' style={{whiteSpace: 'pre-line'}}>{t('credit')}</span>
    </div>
    <div className='col-1 text-center'>
      <Link to='/cart' className='h6 no-link no-hover'>
        <FontAwesomeIcon icon='shopping-cart' />
        <br/>
        <span className='text-nowrap'>{t('cart')} <br/> {total} ({currency})</span>
      </Link>
    </div>
    <div className='col-1'></div>
  </div>
}