import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

export default function BedSheetsSizesManager({sizes, currentSize, changeSize}) {
  const [t, i18n] = useTranslation('productDetails');

  let reprSize = (size, showItemsCount=false) => {
    let dims = `${size.width}x${size.length}`
    if (showItemsCount) {
      return dims + ` ${size['pillowcase_sizes'].length * 2 + 2}${t('pieces')}.`
    }
    return dims
  }

  return (
    <div>
      <div className="d-flex flex-column flex-wrap align-items-stretch h6">
        <div className="mt-3">
          <span>{t('width')} & {t('length')}:</span>
          <div className="mt-2">
            <div className="d-flex justify-content-between border-bottom p-2 dropdown-toggle" data-bs-toggle="dropdown">
              <span>{reprSize(currentSize, true)}</span>
              <FontAwesomeIcon icon='angle-down' />
            </div>
            <ul className="dropdown-menu">
            {sizes.map((size, index) => {
            return (
              <li
                onClick={() => size.priceEUR != currentSize.priceEUR && changeSize(size)}
                key={index}
                className="dimension p-1 ps-2"
                value={size}
              >
                {reprSize(size, true)}
              </li>
            )})}
            </ul>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row flex-nowrap justify-content-between">
        <div>
          <span>{t('bedding_set')}:</span>
        </div>
        <div className="d-flex flex-column mx-2">
          <span>{t('duvet_cover')}: {reprSize(currentSize['duvet_cover_size'])}</span>
          {currentSize['sheet_size']
          ?
          <span>{t('sheet')}: {reprSize(currentSize['sheet_size'])}</span>
          :
          <span>{t('elasticated_sheet')}: {reprSize(currentSize['elasticated_sheet_size'])}</span>
          }
          {currentSize['pillowcase_sizes'].length == 1
          ?
          <span>2 {t('pillowcase')}: {reprSize(currentSize['pillowcase_sizes'][0])}</span>
          :
          <span>4 {t('pillowcase')}: {reprSize(currentSize['pillowcase_sizes'][0])}; {reprSize(currentSize['pillowcase_sizes'][1])}</span>
          }
        </div>
      </div>
    </div>
  );
}