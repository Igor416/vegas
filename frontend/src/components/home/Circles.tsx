import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ResponsiveProps, TranslatableProps } from "../.."

export function Circles({isMobile, t}: ResponsiveProps & TranslatableProps) {
  const colors = ['lime-green', 'dark-cyan', 'deep-sky-blue']

  return <div className='d-flex flex-column flex-sm-row p-2 py-sm-5 px-sm-0 bg-light justify-content-center align-items-center mt-5'>
    <img src='/static/images/logo.png'/>
    <span style={{fontWeight: 400}} className='ms-sm-5 h1'>{t('is')}</span>
    <div className={(isMobile ? 'flex-column w-100' : 'row-nowrap') + ' d-flex justify-content-between'}>
    {[1, 2, 3].map((num, i) => 
    isMobile
    ?
    <div key={i} style={{fontWeight: 400, backgroundColor: `var(--${colors[i]})`}} className='p-3 text-start text-white w-100 mb-2'>
      <span className='h6'><FontAwesomeIcon icon='check-circle' />&nbsp; {t('char' + num)}</span>
    </div>
    :
    <div key={i} className='d-flex p-3 ms-5 justify-content-center align-items-center text-center text-white rounded-circle' style={{
      width: '12.5vw',
      height: '12.5vw',
      fontWeight: 400,
      backgroundColor: `var(--${colors[i]})`
    }}>
      <span className='h5'>{t('char' + num)}</span>
    </div>
    )}
    </div>
  </div>
}