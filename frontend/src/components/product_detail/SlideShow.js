import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';

const mediaStyles = StyleSheet.create({
  active: {
    'border': '1px solid var(--dark-cyan)'
  },
  unactive: {
    'border': '1px solid var(--lime-green)'
  }
})

export default function SlideShow(props) {
  const product = props.product
  const media = [product.shortcut].concat(product.images, product.videos)
  let [activeId, setActiveId] = useState(0)

  let getVideoUrl = (photoUrl) => {
    let id = photoUrl.split('/').slice(-1)[0].split('.')[0] // /media/videos/<id>.[jpg|png] -> <id>
    return 'https://www.youtube.com/watch?v=' + id
  }

  return (
    <div className="d-flex flex-column border border-1 me-5 p-3">
      <div style={{zIndex: 1000}} className="position-absolute d-flex p-3 h4">
        <div style={{color: (product.best ? 'gold' : 'var(--light-grey)')}}>
          <FontAwesomeIcon icon="fa-star"/>
        </div>
        {product.discount != 0 &&
        <div className="ms-4" style={{color: 'var(--deep-sky-blue)', borderBottom: '1px solid var(--deep-sky-blue)'}}>
          <span>-{product.discount}%</span>
        </div>
        }
      </div>
      <div id="carousel" className="carousel slide" data-interval="false">
        <div className="carousel-inner">
        {media.map((url, index) => {
        return (
          <div key={index} className={"carousel-item " + (index == 0 ? "active" : "")}>
          {
          url.includes('videos')
          ?
            <a href={getVideoUrl(url)} target="_blank">
              <img style={{aspectRatio: 1.512 / 1}} src={url} className="d-block w-100" />
            </a>
          :
            <img style={{aspectRatio: 1.512 / 1}} src={url} className="d-block w-100" />
          }
          </div>
        )})}
        </div>
        <button 
          className="carousel-control-prev h2"
          onClick={() => setActiveId(activeId == 0 ? media.length - 1 : activeId - 1)} 
          style={{width: '5%', color: 'var(--deep-sky-blue)'}} 
          data-bs-target="#carousel" 
          data-bs-slide="prev"
        >
          <FontAwesomeIcon icon='angle-left' />
        </button>
        <button 
          className="carousel-control-next h2"
          onClick={() => setActiveId(activeId == media.length - 1 ? 0 : activeId + 1)} 
          style={{width: '5%', color: 'var(--deep-sky-blue)'}} 
          data-bs-target="#carousel" 
          data-bs-slide="next"
        >
          <FontAwesomeIcon icon='angle-right' />
        </button>
        <div className="d-flex row-nowrap justify-content-between mt-3 align-items-stretch">
          {media.map((url, index) => {
          let active = url == media[activeId]
          return (
          <div
            style={{width: 100 / (media.length + 1) + '%'}}
            key={index}
            onClick={() => setActiveId(index)}
            data-bs-target="#carousel"
            data-bs-slide-to={index}
            className={css(active ? mediaStyles.active : mediaStyles.unactive) + ` transition-s${index == 0 ? " active" : ""}`}
            aria-current={index == 0 ? "true" : "false"}
          >
            <img style={{aspectRatio: 1.512 / 1}} src={url} />
          </div>
          )})}
        </div>
      </div>
    </div>
  );
}