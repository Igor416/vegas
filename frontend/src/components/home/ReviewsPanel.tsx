import { useEffect, useState } from "react"
import { Review } from "../../JSONTypes"
import { getReviews, sendReview } from "../../api"
import { CustomInput, CustomButton } from "../reusables"
import { useForm } from "../../hooks"
import { TranslatableProps } from "../.."
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function Reviews({t}: TranslatableProps) {
  const {data, updateField, updateFields, submitForm} = useForm(sendReview)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    getReviews().then(setReviews)
    let today = new Date()
    updateFields(['title', 'date', 'city', 'text'], ['', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`, '', ''])
  }, [])
  
  return <>
  <div className='w-100 pt-3 border'>
    <span className='h4 border-bottom border-2'>{t('reviews')}:</span>
    <div id='carouselReviews' className='p-2 pb-5 p-sm-5 mt-1 carousel slide' data-interval='false'>
      <div className='carousel-indicators'>
        {reviews.map((_, i) => <button
          key={i}
          data-bs-target='#carouselReviews'
          data-bs-slide-to={i}
          className={(i === 0 ? 'active ' : '') + 'bg-dark'}
        />)}
      </div>
      <div className='carousel-inner'>
      {reviews.map((review, i) => <div key={i} className={(i === 0 ? 'active ' : '') + 'text-center carousel-item'}>
        <div className='d-flex flex-column mb-4 text-center h6'>
          <div className='d-flex w-100 row-nowrap justify-content-between'>
            <span><FontAwesomeIcon icon='calendar-alt' />&nbsp;{review.date}</span>
            <span><FontAwesomeIcon icon='map-marker-alt' />&nbsp;{review.city}</span>
          </div>
          <span className='h5'>{review.title}</span>
        </div>
        <span className='w-100'>{review.text}</span>
      </div>)}
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
      {Object.keys(data).filter(key => key != 'date').map((key, i) => <div key={i} className='mt-2 d-flex flex-column'>
        <label htmlFor={key} className='h6'>{t(key)}: </label>
        <CustomInput
          color='dark-cyan'
          className='px-0'
          type='text'
          id={key}
          value={data[key as keyof Review]}
          onChange={value => updateField(key as keyof Review, value)}
        />
      </div>)}
      <div className='w-100 d-flex justify-content-end mt-3'>
        <div onClick={submitForm}>
          <CustomButton color='dark-cyan' text={t('leave')} />
        </div>
      </div>
    </form>
    </>
}