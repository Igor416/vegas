import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect, useContext } from "react"
import { TranslatableProps } from "../../.."
import { MattressColectionPrice } from "../../../JSONTypes"
import { getMattressColectionsPrice } from "../../../api"
import { CustomLink } from "../../reusables"
import { CurrencyContext } from "../../../providers"
import { SubCategory, getLink } from "../supplies"

interface FiltersPanelProps extends TranslatableProps {
  subCategories: SubCategory[],
  subCategory: number
  close: () => void,
}

export function FiltersPanel({t, i18n, subCategories, subCategory, close}: FiltersPanelProps) {
  const [mattressColectionsPrice, setMattressColectionsPrice] = useState<MattressColectionPrice>()
  const currency = useContext(CurrencyContext)

  useEffect(() => {
    getMattressColectionsPrice().then(data => {
      let sortedData: MattressColectionPrice = {}
      for (let el of data) {
        sortedData[Object.keys(el)[0]] = Object.values(el)[0]
      }
      
      setMattressColectionsPrice(sortedData)
    })
  }, [])

  return <div style={{left: 0, height: '100vh'}} className={(subCategory > -1 ? 'menu-show' : 'menu-hide') + ' position-absolute transition bg-white d-flex flex-column'}>
    <div className='d-flex flex-column'>
      <div
        onClick={close}
        style={{backgroundColor: 'var(--dark-cyan)'}}
        className='w-100 p-3 d-flex justify-content-between align-items-center border-bottom text-white'
      >
        <FontAwesomeIcon icon='angle-left' color='white' />
        <span>{subCategory > -1 && subCategories[subCategory].name[i18n?.language as string]}</span>
      </div>
      {mattressColectionsPrice && subCategory > -1 && subCategories[subCategory].filters.map((filter, i) => <div
        key={i}
        className='w-100 p-3 d-flex justify-content-between border-bottom'
      >
        <CustomLink to={getLink(subCategories[subCategory].link, filter.name.en)} text={filter.name[i18n?.language as string]}/>
        {
          subCategories[subCategory].link == 'Mattress/collection'
          &&
          <span>{`${t('from')}: ${mattressColectionsPrice[filter.name.en].price[currency]} (${currency})`}</span>
        }
      </div>)}
    </div>
  </div>
}