import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { Size } from '../../JSONTypes';

interface BedSizesManagerProps {
  extra_width: number,
  extra_length: number,
  sizes: Size[],
  active: number,
  setActive: (val: number) => void
}

export function BedSizesManager({extra_width, extra_length, sizes, active, setActive}: BedSizesManagerProps) {
  const [t, i18n] = useTranslation('productDetails');

  let reprSize = (size: Size) => {
    return `${size.width}x${size.length}`
  }

  let reprBedSize = (size: Size) => {
    return `${size.width + extra_width}x${size.length + extra_length}`
  }

  return <div>
    <div className='d-flex flex-column flex-wrap align-items-stretch h6'>
      <div className='mt-3'>
        <span>{t('place_dims')}:</span>
        <div className='mt-2'>
          <div className='d-flex justify-content-between border-bottom p-2 dropdown-toggle' data-bs-toggle='dropdown'>
            <span>{active > -1 && reprSize(sizes[active])}</span>
            <FontAwesomeIcon icon='angle-down' />
          </div>
          <ul className='dropdown-menu'>
          {sizes.map((size, i) => <li
            onClick={() => size.price.EUR != sizes[active].price.EUR && setActive(i)}
            key={i}
            className='dimension p-1 ps-2'
          >
            {reprSize(size)}
          </li>
          )}
          </ul>
        </div>
      </div>
    </div>
    <div className='d-flex flex-row flex-nowrap justify-content-between h6'>
      <div>
        <span>{t('bed_dims')}:</span>
      </div>
      <div className='d-flex flex-column mx-2'>
        <span>
          {active > -1 && reprBedSize(sizes[active])}
        </span>
      </div>
    </div>
  </div>
}