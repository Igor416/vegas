import React, { useEffect, useRef } from 'react';
import { useLocation, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';

interface LocationListenerProps {
  locationChanged: (location: Location, locChanged: boolean) => void
}

export default function LocationListener({locationChanged}: LocationListenerProps) {
  const [t, i18n] = useTranslation('main');

  const location = useLocation();
  const prevlocation = usePrevious(location);
  const [cookies, setCookie, removeCookie] = useCookies(['lang'])
  const prevCookie = usePrevious(cookies)
  useEffect(() => {
    if (prevlocation != undefined || prevCookie != undefined) {
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
    locationChanged(location, location.pathname == prevlocation?.pathname);
  }, [location, cookies.lang]);

  return <div id='location_listener'></div>;
}

function usePrevious(value?: any) {
  const ref = useRef<any>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}