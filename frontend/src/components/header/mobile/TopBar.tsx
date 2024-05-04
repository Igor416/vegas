import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { TranslatableProps } from "../../..";
import { langs } from "../supplies";

interface TopBarProps extends TranslatableProps {
  menuOpened: boolean,
  toggleMenu: () => void
}

export function TopBar({t, i18n, menuOpened, toggleMenu}: TopBarProps) {
  return <div style={{boxShadow: '0 1rem 1.5rem -.5rem rgba(0, 0, 0, .25)'}} className='container-fluid row p-3 align-items-center m-0'>
    <div className='d-flex col-3 justify-content-center align-items-center'>
      <div
        onClick={() => toggleMenu()}
        style={{width: '12vw', height: '9vw'}}
        className='position-relative burger'
      >
        <div
          style={{top: 0}}
          className={(menuOpened ? 'burger-sided' : '') + ' rounded-pill transition position-absolute bg-dark'}
        />
        <div
          style={{top: '3.6vw'}}
          className={(menuOpened ? 'burger-top': '') + ' rounded-pill transition position-absolute bg-dark'}
        />
        <div
          style={{top: '3.6vw'}}
          className={(menuOpened ? 'burger-bottom' : '') + ' rounded-pill transition position-absolute bg-dark'}
        />
        <div
          style={{top: '7.2vw'}}
          className={(menuOpened ? 'burger-sided' : '') + ' rounded-pill transition position-absolute bg-dark'}
        />
      </div>
    </div>
    <div className='col-4'>
      <Link to='/'>
        <img src='/static/images/logo.png'/>
      </Link>
    </div>
    <div className='col-2 d-flex row-nowrap justify-content-around p-3'>
      {i18n && langs.filter(lang => lang != i18n.language).map((lang, i) => <button
        key={i}
        onClick={() => i18n.changeLanguage(lang)}
        className='p-2 bg-white border-0 outline-0 no-hover h4'
      >
        <span className='border-bottom'>{lang}</span> 
      </button>)}
    </div>
    <div className='col-3 d-flex justify-content-center align-items-center'>
      <div
        style={{
          height: '9vw',
          width: '9vw',
          backgroundColor: 'var(--dark-cyan)'
        }}
        className='rounded-circle p-3 d-flex justify-content-center align-items-center'
        data-bs-toggle='tooltip'
        data-bs-placement='bottom'
        title={`${t('order')}: 079 40-70-32`}
      >
        <FontAwesomeIcon icon='phone' color='white' />
      </div>
    </div>
  </div>
}