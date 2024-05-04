interface HoverableProps {
  text: string
}

export function Hoverable({text}: HoverableProps) {
  return <div className='hoverable'>
    <span>{text}</span>
    <div className='mt-1 transition'></div>
  </div>
}