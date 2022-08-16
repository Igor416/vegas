import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LocationListener({locationChanged}) {
  let location = useLocation();
  useEffect(() => {
    locationChanged(location);
  }, [location]);

  return <div></div>;
}