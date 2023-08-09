import React from 'react';
import { Link } from 'react-router-dom';

import Hoverable from './Hoverable';

interface CustomLinkProps {
  to: string,
  text: string
}

export default function CustomLink({to, text}: CustomLinkProps) {
  if (to == '') {
    return (
      <div className='no-hover no-link'>
        <Hoverable text={text} />
      </div>
    );
  }

  to = to.replace(/ /g, '_')

  return (
    <Link className='no-hover no-link' to={to}>
      <Hoverable text={text}/>
    </Link>
  );
}