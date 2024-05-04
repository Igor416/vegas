import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { TopBar } from './TopBar';
import { FiltersPanel } from './FiltersPanel';
import { SubCategoriesPanel } from './SubCategoriesPanel';
import { CategoriesPanel } from './CategoriesPanel';
import { CartContext, CurrencyContext } from '../../../providers';
import { useTotal } from '../../../hooks';
import { Category } from '../supplies';

const CATEGORIES: Category[] = require('../links.json');

export function MobileHeader() {
  const [menuOpened, setMenuOpened] = useState(false)
  const [category, setCategory] = useState(-1)
  const [subCategory, setSubCategory] = useState(-1)
  const location = useLocation()
  const [t, i18n] = useTranslation('header');
  const currency = useContext(CurrencyContext)
  const products = useContext(CartContext)
  const total = useTotal(products, currency)

  useEffect(() => {
    if (menuOpened) {
      toggleMenu();
      $('html, body').animate({
        scrollTop: 0
    }, 0);
    }
  }, [i18n.language, location])

  const toggleMenu = () => {
    setMenuOpened(!menuOpened)
    document.getElementById('header')?.classList.toggle('sticky-top')
    if (!menuOpened) {
      setCategory(-1)
      setSubCategory(-1)
    }
  }

  return <div id='header' style={{zIndex: 1200}} className='bg-white'>
    <TopBar t={t} i18n={i18n} menuOpened={menuOpened} toggleMenu={toggleMenu} />
    <div style={{left: 0, height: '100vh'}} className={(menuOpened ? 'menu-show' : 'menu-hide') + ' position-absolute transition bg-white d-flex flex-column overflow-scroll'}>
     <CategoriesPanel
        t={t}
        i18n={i18n}
        CATEGORIES={CATEGORIES}
        toggleMenu={toggleMenu}
        setCategory={setCategory}
      />
      <div style={{backgroundColor: 'var(--milk)'}} className='flex-grow-1 w-100 d-flex row-nowrap'>
        <div className='w-50 pt-3 text-center'>
          <span>
            <FontAwesomeIcon icon='phone' />
          </span>
          <br/>
          <span className='h6'>{t('order')}: <br/>079 40-70-32</span>
        </div>
        <Link
          onClick={() => toggleMenu()}
          to='/cart'
          className='w-50 pt-3 text-center no-link no-hover'
        >
          <span>
            <FontAwesomeIcon icon='shopping-cart' />
          </span>
          <br/>
          <span className='h6'>{t('cart')} <br/> {total} ({currency})</span>
        </Link>
      </div>
      <SubCategoriesPanel
        t={t}
        i18n={i18n}
        categories={CATEGORIES}
        category={category}
        close={() => setCategory(-1)}
        setSubCategory={setSubCategory}
      />
      <FiltersPanel
        t={t}
        i18n={i18n}
        subCategories={category > -1 ? CATEGORIES[category].subCategories : []}
        subCategory={subCategory}
        close={() => setSubCategory(-1)}
      />
    </div>
  </div>
}