import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TranslatableProps } from "../../.."
import { SearchBar } from "../../reusables"
import { Link } from "react-router-dom"
import { Category } from "../supplies"

interface CategoriesPanelProps extends TranslatableProps {
  CATEGORIES: Category[],
  toggleMenu: () => void,
  setCategory: (val: number) => void
}

export function CategoriesPanel({t, i18n, CATEGORIES, toggleMenu, setCategory}: CategoriesPanelProps) {
  return <div className='d-flex flex-column'>
    <div id='searchBar' style={{backgroundColor: 'var(--dark-cyan)'}} className='w-100 p-3'>
      <SearchBar width='92.5%' />
    </div>
    <Link
      onClick={toggleMenu}
      to='/sales'
      className='w-100 p-3 border-bottom no-link no-hover'
    >
      <span>{t('sales')}</span>
    </Link>
    <Link
      onClick={toggleMenu}
      to='/stock'
      className='w-100 p-3 border-bottom no-link no-hover'
    >
      <span>{t('stock')}</span>
    </Link>
    {CATEGORIES.map((category, i) => <div
      onClick={() => setCategory(i)}
      key={i}
      className='w-100 p-3 d-flex justify-content-between border-bottom'
    >
      <span>{category.name[i18n?.language as string]}</span>
      <FontAwesomeIcon icon='angle-right' color='var(--lime-green)' />
    </div>)}
    <Link
      onClick={toggleMenu}
      to='/shops'
      className='w-100 p-3 no-link no-hover'
    >
      <span>{t('shops')}</span>
    </Link>
  </div>
}