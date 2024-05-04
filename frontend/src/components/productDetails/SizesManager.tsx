import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { Size } from '../../JSONTypes';

interface Dimensions {
  width: number[],
  length: number[]
}

interface SizesManagerProps {
  sizes: Size[],
  active: number,
  setActive: (val: number) => void
}

export function SizesManager({sizes, active, setActive}: SizesManagerProps) {
  const [t, i18n] = useTranslation('productDetails');
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: [],
    length: []
  })

  useEffect(() => {
    let widths = sizes.map(size => size.width)
    let lengths = sizes.map(size => size.length)

    setDimensions({
      width: widths.filter((width, i) => widths.indexOf(width) === i),
      length: lengths.filter((length, i) => lengths.indexOf(length) === i)
    }) //remove duplicates
  }, [sizes])

  const changeSize = (value: number, dimension: keyof Dimensions) => {
    if (active === -1) {
      return
    }
    const other = dimension === 'width' ? 'length' : 'width'
    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i][dimension] === value && sizes[i][other] === sizes[active][other]) {
        setActive(i)
        return
      }
    }
    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i][dimension] === value) {
        setActive(i)
        return
      }
    }
  }

  return <div className='d-flex flex-column flex-wrap align-items-stretch h6'>
    {active > -1 && ['width', 'length'].map((dimension, i) => <div key={i} className='mt-3'>
      <div className='d-flex justify-content-between'>
        <span>{t(dimension)}:</span>
        {i == 0 && sizes[active].discount != 0 &&
        <span style={{color: 'var(--deep-sky-blue)'}}>-{sizes[active].discount}%</span>
        }
      </div>
      <div className='mt-2'>
        <div className='d-flex justify-content-between border-bottom p-2 dropdown-toggle' data-bs-toggle='dropdown'>
          <span>{sizes[active][dimension as keyof Size].toString()}</span>
          <FontAwesomeIcon icon='angle-down' />
        </div>
        <ul className='dropdown-menu'>
        {dimensions[dimension as keyof Dimensions].map((dim, i) => <li
            onClick={() => sizes[active][dimension as keyof Size] != dim && changeSize(dim, dimension as keyof Dimensions)}
            key={i}
            className='dimension p-1 ps-2'
            value={dim}
          >
            {dim}
          </li>
        )}
        </ul>
      </div>
    </div>)}
  </div>
}