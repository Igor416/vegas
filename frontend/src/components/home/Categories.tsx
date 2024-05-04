import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Category } from "../../JSONTypes"
import { CustomButton } from "../reusables"
import { TranslatableProps } from "../.."
import { getCategories } from "../../api"

export function Categories({t, i18n}: TranslatableProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [active, setActive] = useState(-1)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [i18n?.language])

  useEffect(() => {
    if (categories.length > 0) {
      setActive(0)
    }
  }, [categories])

  return <div className='d-flex flex-column col-12 mt-5'>
    <div className='d-flex flex-nowrap overflow-scroll col-12'>
      {categories.map((category, i) => {
        return <div onClick={() => setActive(i)} key={i} className='d-flex flex-column align-items-center col-5'>
          <img src={`/static/images/${category.name.toLowerCase()}_icon.png`} />
          <span className='h5'>{category.name_s}</span>
        </div>
      })}
    </div>
    {active > -1 && <div className='d-flex flex-column align-items-center col-12 p-2'>
      <span className='h3 col-12 text-center'>{categories[active].name_s}</span>
      <span className='h6 col-12'>{categories[active].desc}</span>
      <Link to={'/catalog/' + categories[active].name + '/all'}>
        <CustomButton color='lime-green' text={t('category')} />
      </Link>
    </div>}
  </div>
}