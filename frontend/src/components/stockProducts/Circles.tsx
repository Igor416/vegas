import { ResponsiveProps, TranslatableProps } from '../..';
import { Stock } from '../../JSONTypes';

interface CircleProps extends ResponsiveProps, TranslatableProps {
  stock: Stock[],
  active: number,
  setActive: (val: number) => void
}

export function Circles({isMobile, t, stock, active, setActive}: CircleProps) {
  const updateCurrentStock = (i: number) => {
    if (!stock || active === -1) {
      return
    }
    let old = active;
    if (old === i) {
      return
    }
    setActive(i)

    let arr = document.getElementById('stock') as HTMLElement;
    let new_arr: HTMLElement[] = [];
    for (let j = 0; j < arr.children.length; j++) {
      new_arr.push(arr.children[j] as HTMLElement)
    }
    i = new_arr.indexOf(document.getElementById('' + i) as HTMLElement);

    let end = new_arr.slice(0, i);
    new_arr = new_arr.slice(i, new_arr.length);
    new_arr.push(...end);

    arr.replaceChildren(...new_arr);
  }

  return <div id='stock' style={isMobile ? {height: '95vw', width: '95vw'} : {height: '50vh', width: '50vh'}}>
    {stock.map((stock, i) => {
    let length = stock.collections.length
    let collections;
    if (length > 1) {
      collections = stock.collections[0] + '...'
    } else {
      collections = stock.collections[0]
    }
    return (
      <div
        id={'' + i}
        onClick={() => updateCurrentStock(i)}
        style={{
          top: isMobile ? '40%' : '50%',
          left: isMobile ? '35%' : '20%',
          width: '12vh',
          height: '12vh',
          backgroundColor: 'var(--milk)',
        }}
        data-bs-target='#carouselStock'
        data-bs-slide-to={i}
        className='position-absolute transition p-3 rounded-circle d-flex flex-column align-items-center justify-content-center text-center'
        key={i}
      >
        <span>-{stock.discount}% {t('on')} {length === 1 ? t('collection') : t('collections')}: {collections}</span>
      </div>
    )})}
  </div>
}