import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TranslatableProps } from "../../.."
import { CustomLink } from "../../reusables"
import { Best } from "./Best"
import { Category, getLink } from "../supplies"

interface SubCategoriesPanelProps extends TranslatableProps {
  categories: Category[],
  category: number
  close: () => void,
  setSubCategory: (val: number) => void
}

export function SubCategoriesPanel({t, i18n, categories, category, close, setSubCategory}: SubCategoriesPanelProps) {
  return <div style={{left: 0, height: '100vh'}} className={(category > -1 ? 'menu-show' : 'menu-hide') + ' position-absolute transition bg-white d-flex flex-column'}>
    <div className='d-flex flex-column'>
      <div
        onClick={close}
        style={{backgroundColor: 'var(--dark-cyan)'}}
        className='w-100 p-3 d-flex justify-content-between align-items-center border-bottom text-white'
      >
        <FontAwesomeIcon icon='angle-left' color='white' />
        <span>{category > -1 && categories[category].name[i18n?.language as string]}</span>
      </div>
      {category > -1 && categories[category].subCategories.map((subCategory, i) => <div
        onClick={() => setSubCategory(i)}
        key={i}
        className='w-100 p-3 d-flex justify-content-between border-bottom'
      >
        <CustomLink to={subCategory.filters.length === 0 ? getLink(subCategory.link) : ''} text={subCategory.name[i18n?.language as string]} />
        {subCategory.filters.length != 0 && <FontAwesomeIcon icon='angle-right' color='var(--lime-green)' />}
      </div>)}
      {category > -1 && <div className='d-flex align-items-end justify-content-center'>
        <span style={{color: 'var(--dark-cyan)'}} className='h4'>Hit Sales</span>
      </div>}
      <Best t={t} i18n={i18n} category={category} />
      <div style={{height: '20vh'}} className='w-100'></div>
    </div>
  </div>
}