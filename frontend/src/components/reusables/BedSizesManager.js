import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

export default function BedSizesManager({extra_width, extra_length, sizes, currentSize, changeSize}) {
  const [t, i18n] = useTranslation('productDetails');

  let reprSize = (size) => {
    return `${size.width}x${size.length}`
  }

  let reprBedSize = (size) => {
    return `${size.width + extra_width}x${size.length + extra_length}`
  }

  return (
    <div>
      <div className="d-flex flex-column flex-wrap align-items-stretch h6">
        <div className="mt-3">
          <span>{t('place_dims')}:</span>
          <div className="mt-2">
            <div className="d-flex justify-content-between border-bottom p-2 dropdown-toggle" data-bs-toggle="dropdown">
              <span>{reprSize(currentSize, true)}</span>
              <FontAwesomeIcon icon='angle-down' />
            </div>
            <ul className="dropdown-menu">
            {sizes.map((size, index) => {
            return (
              <li
                onClick={() => size.priceMDL != currentSize.priceMDL && changeSize(size)}
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
      <div className="d-flex flex-row flex-nowrap justify-content-between h6">
        <div>
          <span>{t('bed_dims')}:</span>
        </div>
        <div className="d-flex flex-column mx-2">
          <span>
            {reprBedSize(currentSize)}
          </span>
        </div>
      </div>
    </div>
  );
}
