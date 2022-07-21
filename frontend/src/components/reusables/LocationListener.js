import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LocationListener(props) {
  let location = useLocation();
  console.log(location)
  useEffect(() => {
    console.log(location)
    props.locationChanged(location);
  }, [location]);

  return <div></div>;
}