import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LocationListener(props) {
  let location = useLocation();
  useEffect(() => {
    props.locationChanged(location);
  }, [location]);

  return <div></div>;
}