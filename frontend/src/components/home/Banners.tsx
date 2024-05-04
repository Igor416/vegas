import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TranslatableProps } from "../..";
import { useState, useEffect } from "react";
import { getBanners } from "../../api";

export function Banners({i18n}: TranslatableProps) {
  const [banners, setBanners] = useState<string[]>([])

  useEffect(() => {
    getBanners().then(setBanners)
  }, [i18n?.language])

  return <div id='carousel' className='carousel slide carousel-fade' data-bs-ride='carousel' data-interval='1500'>
    <div className='carousel-inner'>
    {banners.map((banner, i) => <div key={i} className={'carousel-item ' + (i === 0 ? 'active' : '')}>
      <img src={banner} className='d-block w-100' />
    </div>)}
    </div>
    <button 
      className='carousel-control-prev h2'
      style={{width: '5%', color: 'var(--dark-cyan)'}} 
      data-bs-target='#carousel' 
      data-bs-slide='prev'
    >
      <FontAwesomeIcon icon='angle-left' />
    </button>
    <button 
      className='carousel-control-next h2'
      style={{width: '5%', color: 'var(--dark-cyan)'}} 
      data-bs-target='#carousel' 
      data-bs-slide='next'
    >
      <FontAwesomeIcon icon='angle-right' />
    </button>
  </div>
}