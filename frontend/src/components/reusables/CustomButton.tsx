interface CustomButtonProps {
  color: string,
  text: string
}

export function CustomButton({color, text}: CustomButtonProps) {
  return <button style={{whiteSpace: 'nowrap'}} className={color + '-button outline-0 p-3 transition'}>
    <span>{text}</span>
  </button>
}