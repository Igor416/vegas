import { useEffect, useState } from "react"

import { ResponsiveProps, TranslatableProps } from "../.."
import { DetailedProduct } from "../../JSONTypes"
import { CustomButton } from "../reusables"
import { Line } from "./Line"

interface TabsProps extends ResponsiveProps, TranslatableProps {
  product: DetailedProduct
}

export function Tabs({isMobile, t, product}: TabsProps) {
  const [madeInMD, setMadeInMD] = useState(false)
  const [tabs, setTabs] = useState<string[]>([])
  
  useEffect(() => {
    setMadeInMD(['Bed', 'Basis', 'Stand'].includes(product.category.name))
    let tabs = ['description', 'characteristic'];
    if (product['structure']) {
      tabs.push('structure')
      if (product['technologies'] && !isMobile) {
        tabs.push('technologies')
      }
    }
    setTabs(tabs)
  }, [product])

  const repr = (val: any) => {
    //val is array, number or boolean
    if (Array.isArray(val)) {
      return val.join(' / ')
    }

    if (typeof val === 'boolean') {
      return val ? t('yes') : t('no')
    }
  
    return val
  }

  return <div className='mt-5'>
    <div style={{borderColor: 'var(--deep-sky-blue)'}} className='nav nav-tabs ps-1 ps-sm-5' id='tab'>
    {tabs.filter(tab => product[tab as keyof DetailedProduct]).map((tab, i) => <button
      key={i}
      id={'tab-' + tab}
      className={'nav-link link' + (i === 0 ? ' active' : '')}
      data-bs-toggle='tab'
      data-bs-target={`#${tab}`}
    >
      {t(tab)}
    </button>
    )}
    </div>
    <div className='tab-content' id='tabContent'>
      <div className='flex-column border border-top-0 p-sm-4 tab-pane fade show active' id='description'>
        <div className='mb-3 p-2 p-sm-0 mt-3 mt-sm-0' style={{whiteSpace: 'pre-line'}}>
          <span>{product.desc}</span>
        </div>
        <div className={(isMobile ? 'flex-column' : 'row-nowrap') + ' d-flex mt-3'}>
          <div className='d-flex flex-column justify-content-between col-sm-6 p-sm-4'>
            <div>
            {Object.keys(product.description).map((key, i) => <Line key={i} isMobile={isMobile} t={t} label={key} val={product.description} />)}
            </div>
            <div className='mt-3 mt-sm-0 mx-auto m-sm-0' onClick={() => {
              try {
                $('#tab-characteristic').tab('show');
                $('#characteristic').tab('show');
              } catch (error) {
                //displays error in console, however it works perfectly
              }
            }}>
              <CustomButton text={t('characteristic')} color='deep-sky-blue' />
            </div>
          </div>
          <div className='col-sm-6 d-flex justify-content-end'>
            <img src={product.shortcut} />
          </div>
        </div>
      </div>
      <div className={(isMobile ? 'flex-column' : 'row-nowrap') + ' border border-top-0 p-sm-4 tab-pane fade'} id='characteristic'>
        <div className={(isMobile ? '' : 'border-end') + 'd-flex flex-column col-sm-6 justify-content-top p-sm-4'}>
          <Line isMobile={isMobile} t={t} label={t('brand')} val='Vegas' />
          {Object.keys(product.characteristic).slice(0, 8).map((key, i) => 
            <Line key={i} isMobile={isMobile} t={t} label={key} val={product.characteristic} />
          )}
        </div>
        <div className='d-flex flex-column col-sm-6 justify-content-top p-sm-4'>
          {Object.keys(product.characteristic).slice(8).map((key, i) =>
            <Line key={i} isMobile={isMobile} t={t} label={key} val={product.characteristic} />
          )}
          {['country', 'manufacturer'].map((key, i) => 
            <Line key={i} isMobile={isMobile} t={t} label={t(key)} val={madeInMD ? t(key + 'text1') : t(key + 'text')} />
          )}
          <Line isMobile={isMobile} t={t} label={t('note')} val={t('notetext')} little={true} />
        </div>
      </div>
      {tabs.includes('structure') && <div className='flex-column border border-top-0 p-4 tab-pane fade' id='structure'>
      {product.structure && product.structure.map((layer, i) => <div key={i} className={(isMobile ? 'flex-column' : 'row-nowrap') + ' d-flex border-bottom py-4'}>
          <div style={{color: 'var(--deep-sky-blue)'}} className='col-sm-3 h5'>
            <span>{layer.name}</span>
          </div>
          <div className='col-sm-2 d-flex align-items-center'>
            <div className='rounded-circle d-flex align-items-center justify-content-center position-absolute text-white structure-quantity'>
              <span>{i + 1}</span>
            </div>
            <img src={layer.image} />
          </div>
          <div className='col-sm-7'>
            <span>{layer.desc}</span>
          </div>
        </div>
      )}
      </div>}
      {tabs.includes('technologies') && <div className='flex-column border border-top-0 p-4 tab-pane fade' id='technologies'>
      {product.technologies && product.technologies.map((technology, i) => <div key={i} className='d-flex row-nowrap border-bottom py-4'>
          <div className='d-flex align-items-center justify-content-center col-2'>
            <img className='w-75' src={technology.image} />
          </div>
          <div className='col-10 d-flex flex-column'>
            <div style={{color: 'var(--deep-sky-blue)'}} className='h5'>
              <span>{technology.name}</span>
            </div>
            <div>
              <span>{technology.desc}</span>
            </div>
          </div>
        </div>
      )}
      </div>}
    </div>
  </div>
}