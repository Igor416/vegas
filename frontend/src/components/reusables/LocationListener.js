import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LocationListener({locationChanged}) {
  const [t, i18n] = useTranslation('main');

  let location = useLocation();
  let prevlocation = usePrevious(location);
  useEffect(() => {
    if (prevlocation != undefined) {
      let title = location.pathname.split('/')[1]
      let titles = {
        '': 'home',
        'sales': 'catalog'
      }
      if (title in titles) {
        title = titles[title]
      }
      document.title = t(`titles.${title}`);
    }
    locationChanged(location, location.search == prevlocation?.search);
  }, [location]);

  return <div className="location-listener"></div>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}