import { useTranslation } from 'react-i18next';

import { Reviews } from './ReviewsPanel';
import { Banners } from './Banners';
import { Categories } from './Categories';
import { Circles } from './Circles';
import { ResponsiveProps } from '../..';

export function Home({isMobile}: ResponsiveProps) {
  const [t, i18n] = useTranslation('home');

  return <div className='mt-5'>
    <div className={'container-fluid text-center mt-5 p-0 p-sm-auto'}>
      <div className='d-flex px-2 py-1 px-sm-5 py-sm-4'>
        <div className='col-sm-1'></div>
        <div className='col-12 col-sm-10'>
          <Banners t={t} i18n={i18n} />
        </div>
        <div className='col-sm-1'></div>
      </div>
      {isMobile && <Categories t={t} i18n={i18n} />}
      <Circles isMobile={isMobile} t={t} />
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
        <iframe className='col-12 col-sm-8' style={{aspectRatio: isMobile ? 9/16 : 16/9}} src={
          isMobile
          ?
          'https://www.youtube.com/embed/oiFlUSzmDlg'
          : (
          i18n.language === 'ru'
          ?
          'https://www.youtube.com/embed/JpgS_TvcamA'
          :
          'https://www.youtube.com/embed/g4r4hbbVV3M'
        )} title='VEGAS REKLAMA new' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowFullScreen></iframe>
        <div className='col-sm-2'></div>
      </div>
      <div className='d-flex mt-5 px-2 px-sm-auto'>
        <div className='col-sm-2'></div>
        <div className='col-sm-8'>
          <Reviews t={t} />
        </div>
        <div className='col-sm-2'></div>
      </div>
    </div>
  </div>
}