import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LocationListener({locationChanged}) {
  const [t, i18n] = useTranslation('titles');

  let location = useLocation();
  let prevlocation = usePrevious(location);
  useEffect(() => {
    if (prevlocation != undefined) {
      let title = location.pathname.split('/')[1]
      if (title == '') {
        title = 'home'
      }
      document.title = t(title);
    }
    locationChanged(location);
  }, [location]);

  return <div></div>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}