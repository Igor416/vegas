import React from 'react';

interface HoverableProps {
  text: string
}

export default function Hoverable({text}: HoverableProps) {
  return (
    <div className='hoverable'>
      <span>{text}</span>
      <div className='mt-1 transition'></div>
    </div>
  )
}