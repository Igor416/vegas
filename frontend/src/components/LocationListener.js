import * as React from 'react';
import { useLocation } from 'react-router-dom';

export default function LocationListener(props) {
  let location = useLocation();
  React.useEffect(() => {
    props.locationChanged();
  }, [location]);

  return <div></div>;
}