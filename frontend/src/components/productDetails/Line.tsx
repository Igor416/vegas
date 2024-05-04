import { ResponsiveProps, TranslatableProps } from "../..";

interface LineProps extends ResponsiveProps, TranslatableProps {
  label: string,
  val: any,
  little?: boolean
}

export function Line({isMobile, t, label, val, little = false}: LineProps) {
  const repr = (val: any) => {
    //val is array, number or boolean
    if (Array.isArray(val)) {
      return val.join(' / ')
    }

    if (typeof val === 'boolean') {
      return val ? t('yes') : t('no')
    }
  
    return val
  }

  return <div className='d-flex flex-column flex-sm-row mb-sm-2 justify-content-between border-bottom'>
    <span style={{backgroundColor: isMobile ? 'var(--milk)' : ''}} className='p-2 p-sm-0'>{label}</span>
    <span className='h6 p-2 p-sm-0' style={little ? {fontSize: '0.75em', whiteSpace: 'pre-line'} : {}}>
      {typeof val === 'string' ? val : repr(val[label])}
    </span>
  </div>
}