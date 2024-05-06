import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { BedSheetsSize, Size } from '../../JSONTypes';

interface BedSheetsSizesManagerProps {
  sizes: BedSheetsSize[],
  active: number,
  setActive: (val: number) => void
}

export function BedSheetsSizesManager({sizes, active, setActive}: BedSheetsSizesManagerProps) {
  const [t, i18n] = useTranslation('productDetails');

  let reprSize = (size: BedSheetsSize | Size, showItemsCount=false) => {
    let dims = `${size.width}x${size.length}`
    if (showItemsCount) {
      return dims + ` ${(size as BedSheetsSize).pillowcase_sizes.length == 5 ? 4 : 6}${t('pieces')}.`
    }
    return dims
  }
  
  return <>
    <div className='d-flex flex-column flex-wrap align-items-stretch h6'>
      <div className='mt-3'>
        <span>{t('width')} & {t('length')}:</span>
        <div className='mt-2'>
          <div className='d-flex justify-content-between border-bottom p-2 dropdown-toggle' data-bs-toggle='dropdown'>
            <span>{active > -1 && reprSize(sizes[active], true)}</span>
            <FontAwesomeIcon icon='angle-down' />
          </div>
          <ul className='dropdown-menu'>
          {sizes.map((size, i) => <li
            onClick={() => size.price.EUR != sizes[active].price.EUR && setActive(i)}
            key={i}
            className='dimension p-1 ps-2'
          >
            {reprSize(size, true)}
          </li>
          )}
          </ul>
        </div>
      </div>
    </div>
    <div className='d-flex flex-row flex-nowrap justify-content-between'>
      <div>
        <span>{t('bedding_set')}:</span>
      </div>
      {active > -1 && <div className='d-flex flex-column mx-2'>
        <span>{t('duvet_cover')}: {sizes[active].duvet_cover_size}</span>
        {sizes[active].sheet_size != ''
        ?
        <span>{t('sheet')}: {sizes[active].sheet_size}</span>
        :
        <span>{t('elasticated_sheet')}: {sizes[active].elasticated_sheet_size}</span>
        }
        <span>{sizes[active].pillowcase_sizes.length === 5 ? 2 : 4} {t('pillowcase')}: {sizes[active].pillowcase_sizes}</span>
      </div>}
    </div>
  </>
}