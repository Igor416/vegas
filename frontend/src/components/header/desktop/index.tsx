import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { CustomLink, Hoverable } from '../../reusables';
import { Modal } from './Modal';
import { TopBar } from './TopBar';
import { Best } from './Best';
import { Menu } from './Menu';
import { Category } from '../supplies';

const CATEGORIES: Category[] = require('../links.json');

export function DesktopHeader() {
  const [category, setCategory] = useState(-1)
  const [subCategory, setSubCategory] = useState(-1)
  const [t, i18n] = useTranslation('header');

  useEffect(() => {
    setCategory(-1)
    setSubCategory(-1)
  }, [i18n.language])
  
  return <div className='bg-white'>
      <TopBar t={t} i18n={i18n} />
      <nav style={{zIndex: 1020}} className='container-fluid position-absolute bg-white px-5 pt-4' onMouseLeave={() => setCategory(-1)}>
        <div className='row'>
          <div className='col-1'></div>
          <div className='col-10 h6 m-0'>
            <div className='d-flex flex-inline justify-content-between transition'>
              <div>
                <CustomLink to='/sales' text={t('sales')} />
              </div>
              <div>
                <CustomLink to='/stock' text={t('stock')} />
              </div>
              {CATEGORIES.map((c, i) => <div
                className='d-flex flex-row pb-2'
                key={i}
                onMouseEnter={() => setCategory(i)}
              >
                <Hoverable text={c.name[i18n.language]} />
                &nbsp;
                <FontAwesomeIcon className={(i === category ? 'angle-active' : 'angle-unactive') + ' transition'} icon='angle-down' /> 
              </div>)}
              <div>
                <CustomLink to='/shops' text={t('shops')} />
              </div>
            </div>
          </div>
          <div className='col-1'></div>
        </div>
        <div className={(category > -1 ? 'menu-show' : 'menu-hide') + ' d-flex flex-column transition'}>
          <Menu
            t={t}
            i18n={i18n}
            subCategories={category > -1 ? CATEGORIES[category].subCategories : []}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
          />
          <div className='row py-2'>
            <div className='col-6'></div>
            <div className={'d-flex align-items-end justify-content-center col-' + (category === 5 ? '4'  : '2')}>
              <span style={{color: 'var(--dark-cyan)'}} className='h4'>{category > -1 ? 'Hit Sales' : ''}</span>
            </div>
          </div>
          <Best t={t} i18n={i18n} category={category} />
        </div>
      </nav>
      <Modal t={t} lang={i18n.language} />
    </div>
}
