import { useEffect, useState } from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DetailedProduct } from "../../JSONTypes";

interface CarouselProps {
  product: DetailedProduct
}

export function Carousel({product}: CarouselProps) {
  const [media, setMedia] = useState<string[]>([])
  
  const getVideoUrl = (photoUrl: string) => {
    let id = photoUrl.split('/').slice(-1)[0].split('.')[0] // /media/videos/<id>.[jpg|png] -> <id>
    return 'https://www.youtube.com/watch?v=' + id
  }

  useEffect(() => {
    setMedia([product.shortcut].concat(product.images, product.videos))
  }, [product])
  
  return <div className='d-flex flex-column border me-sm-5 p-3'>
    <div style={{zIndex: 1000}} className='position-absolute d-flex p-3 h4'>
      <div style={{color: (product.best ? 'gold' : 'var(--milk)')}}>
        <FontAwesomeIcon icon={faStar}/>
      </div>
      {product.discount != 0 &&
      <div className='ms-2 ms-sm-4' style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
        <span>-{product.discount}%</span>
      </div>
      }
    </div>
    <div id='carousel' className='carousel slide' product-interval='false'>
      <div className='carousel-inner'>
      {media.map((url, i) => <div key={i} className={'carousel-item ' + (i === 0 ? 'active' : '')}>
      {
      url.includes('videos')
      ?
        <a href={getVideoUrl(url)} target='_blank'>
          <img style={{aspectRatio: 1.512 / 1}} src={url} className='d-block w-100' />
        </a>
      :
        <img style={{aspectRatio: 1.512 / 1}} src={url} className='d-block w-100' />
      }
      </div>)}
      </div>
      <button 
        className='carousel-control-prev h2'
        style={{width: '5%', color: 'var(--deep-sky-blue)'}} 
        product-bs-target='#carousel' 
        product-bs-slide='prev'
      >
        <FontAwesomeIcon icon='angle-left' />
      </button>
      <button 
        className='carousel-control-next h2'
        style={{width: '5%', color: 'var(--deep-sky-blue)'}} 
        product-bs-target='#carousel' 
        product-bs-slide='next'
      >
        <FontAwesomeIcon icon='angle-right' />
      </button>
      <div className={'carousel-indicators d-flex row-nowrap mt-3 align-items-stretch' + (media.length > 1 ? ' many-items' : ' one-item')}>
        {media.map((url, i) => <div
          style={{width: 100 / (media.length + 1) + '%'}}
          key={i}
          product-bs-target='#carousel'
          product-bs-slide-to={i}
          className={(i === 0 ? 'active ' : '') + 'transition media'}
        >
          <img style={{aspectRatio: 1.512 / 1}} src={url} />
        </div>)}
      </div>
    </div>
  </div>
}