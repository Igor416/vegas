interface CustomInputProps {
  color: string,
  className: string,
  type: string,
  id: string,
  value: any,
  onChange: (value: any) => void,
  checked?: boolean
}

export function CustomInput({color, className, type, id, value, onChange, checked}: CustomInputProps) {
  return <input
    style={{border: 'none', borderBottom: `1px solid var(--${color})`}}
    className={'outline-0 no-hover w-100 ' + className}
    type={type}
    checked={checked}
    id={id}
    value={value}
    onChange={e => onChange(e.target.value)}
  />
}