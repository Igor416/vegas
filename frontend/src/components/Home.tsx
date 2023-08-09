import React, { useState } from 'react';
import { useOutletContext, Location } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import LocationListener from './reusables/LocationListener';
import { getBanners, getReviews, sendReview } from '../api';
import { Banner, Review } from '../JSONTypes';
import Form from './services/form';
import CustomButton from './reusables/CustomButton'
import CustomInput from './reusables/CustomInput';
import { OutletContext } from './App';

export default function Home() {
  const outletContext: OutletContext = useOutletContext();
  const isMobile = outletContext.isMobile;
  const lang = outletContext.lang;
  const [banners, setBanners] = useState<Banner[]>()
  const [reviews, setReviews] = useState<Review[]>()
  const form = new Form<Review>(sendReview)
  const [data, setData] = useState<Review>({} as Review)
  const [t, i18n] = useTranslation('home');

  const colors = ['lime-green', 'dark-cyan', 'deep-sky-blue']

  const updateLang = (path: Location) => {
    getBanners().then((data) => {
      setBanners(data)
    })
    getReviews().then((data) => {
      setReviews(data)
    })
  }

  const submitForm = () => {
    let today = new Date()
    data.date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    form.submitForm(data)
  }

  return (
    <div className='mt-5'>
      <LocationListener locationChanged={updateLang} />
      <div className={'container-fluid text-center mt-5 p-0 p-sm-auto'}>
        <div className='d-flex px-2 py-1 px-sm-5 py-sm-4'>
          <div className='col-sm-1'></div>
          <div className='col-12 col-sm-10'>
          {banners && 
            <div id='carousel' className='carousel slide carousel-fade' data-bs-ride='carousel' data-interval='1500'>
              <div className='carousel-inner'>
              {banners.map((banner, index) => {
              return (
                <div key={index} className={'carousel-item ' + (index == 0 ? 'active' : '')}>
                  <img src={banner.banner} className='d-block w-100' />
                </div>
              )})}
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
          </div>
          <div className='col-sm-1'></div>
        </div>
        <div className={(isMobile ? 'flex-column' : 'row-nowrap') + ' d-flex p-2 py-sm-5 px-sm-0 bg-light justify-content-center align-items-center mt-5'}>
          <img src='/static/images/logo.png'/>
          <span style={{fontWeight: 400}} className='ms-sm-5 h1'>{t('is')}</span>
          <div className={(isMobile ? 'flex-column w-100' : 'row-nowrap') + ' d-flex justify-content-between'}>
          {[1, 2, 3].map((num, index) => {
          if (isMobile) {
            return (
            <div
              key={index}
              style={{
                fontWeight: 400,
                backgroundColor: `var(--${colors[index]})`
              }}
              className='p-3 text-start text-white w-100 mb-2'
            >
              <span className='h6'><FontAwesomeIcon icon='check-circle' />&nbsp; {t('char' + num)}</span>
            </div>
          )}
          return (
            <div
              key={index}
              style={{
                width: '12.5vw',
                height: '12.5vw',
                fontWeight: 400,
                backgroundColor: `var(--${colors[index]})`
              }}
              className='d-flex p-3 ms-5 justify-content-center align-items-center text-center text-white rounded-circle'
            >
              <span className='h5'>{t('char' + num)}</span>
            </div>
          )})}
          </div>
        </div>
        <div className='d-flex text-center mt-5 px-2 pt-sm-5 px-sm-0'>
          <div className='col-sm-3'></div>
          <div className='col-12 col-sm-6'>
            <p className='h2'>{t('main')}</p>
            <br/>
            <p style={{fontWeight: 400, whiteSpace: 'pre-line'}}>{t('desc')}</p>
          </div>
          <div className='col-sm-3'></div>
        </div>
        <div className='d-flex mt-5 px-2 px-sm-auto'>
          <div className='col-sm-2'></div>
          <iframe className='col-12 col-sm-8' style={{aspectRatio: 16/9}} src={lang == 'ru' ? 'https://www.youtube.com/embed/JpgS_TvcamA' : 'https://www.youtube.com/embed/g4r4hbbVV3M'} title='VEGAS REKLAMA new' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowFullScreen></iframe>
          <div className='col-sm-2'></div>
        </div>
        {reviews && 
        <div className='d-flex mt-5 px-2 px-sm-auto'>
          <div className='col-sm-2'></div>
          <div className='col-sm-8'>
            <div className='w-100 pt-3 border'>
              <span className='h4 border-bottom border-2'>{t('reviews')}:</span>
              <div id='carouselReviews' className='p-2 pb-5 p-sm-5 mt-1 carousel slide' data-interval='false'>
                <div className='carousel-indicators'>
                  {reviews.map((_, index) => {
                  return <button
                          key={index}
                          data-bs-target='#carouselReviews'
                          data-bs-slide-to={index}
                          className={(index == 0 ? 'active ' : '') + 'bg-dark'}
                          />
                  })}
                </div>
                <div className='carousel-inner'>
                {reviews.map((review, index) => {
                return (
                  <div key={index} className={(index == 0 ? 'active ' : '') + 'text-center carousel-item'}>
                    <div className='d-flex flex-column mb-4 text-center h6'>
                      <div className='d-flex w-100 row-nowrap justify-content-between'>
                        <span><FontAwesomeIcon icon='calendar-alt' />&nbsp;{review.date}</span>
                        <span><FontAwesomeIcon icon='map-marker-alt' />&nbsp;{review.city}</span>
                      </div>
                      <span className='h5'>{review.title}</span>
                    </div>
                    <span className='w-100'>{review.text}</span>
                  </div>
                )})}
                </div>
                <button 
                  className='carousel-control-prev h2'
                  style={{width: '5%', color: 'var(--dark-cyan)'}} 
                  data-bs-target='#carouselReviews' 
                  data-bs-slide='prev'
                >
                  <FontAwesomeIcon icon='angle-left' />
                </button>
                <button 
                  className='carousel-control-next h2'
                  style={{width: '5%', color: 'var(--dark-cyan)'}} 
                  data-bs-target='#carouselReviews' 
                  data-bs-slide='next'
                >
                  <FontAwesomeIcon icon='angle-right' />
                </button>
              </div>
            </div>
            <form className='my-5 text-start'>
              {Object.keys(data).filter(key => key != 'date').map((key, index) => {
              return (
              <div key={index} className='mt-2 d-flex flex-column'>
                <label htmlFor={key} className='h6'>{t(key)}: </label>
                <CustomInput
                  color='dark-cyan'
                  className='px-0'
                  type='text'
                  id={key}
                  value={data[key as keyof Review]}
                  onChange={value => setData(form.updateForm(data, key as keyof Review, value))}
                />
              </div>
              )})}
              <div className='w-100 d-flex justify-content-end mt-3'>
                <div onClick={submitForm}>
                  <CustomButton color='dark-cyan' text={t('leave')} />
                </div>
              </div>
            </form>
          </div>
          <div className='col-sm-2'></div>
        </div>
        }
      </div>
    </div>
  );
}