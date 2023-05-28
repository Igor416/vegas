import React, { useEffect, useRef } from 'react';
import { useLocation, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LocationListenerProps {
  locationChanged: (location: Location, locChanged: boolean) => void
}

export default function LocationListener({locationChanged}: LocationListenerProps) {
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
      if (title == '' || title == 'sales') {
        title = titles[title]
      }
      document.title = t(`titles.${title}`);
    }
    locationChanged(location, location.search == prevlocation?.search);
  }, [location]);

  return <div className="location-listener"></div>;
}

function usePrevious(value: Location) {
  const ref = useRef<Location>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}