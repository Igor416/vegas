import { useState, useEffect, useContext } from "react";
import { TranslatableProps } from "../../..";
import { MattressColectionPrice } from "../../../JSONTypes";
import { getMattressColectionsPrice } from "../../../api";
import { CustomLink } from "../../reusables";
import { CurrencyContext } from "../../../providers";
import { SubCategory, getLink } from "../supplies";

interface MenuProps extends TranslatableProps {
  subCategories: SubCategory[],
  subCategory: number,
  setSubCategory: (val: number) => void
}

export function Menu({t, i18n, subCategories, subCategory, setSubCategory}: MenuProps) {
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

  return <div className='row border-top py-2' onMouseLeave={() => setSubCategory(-1)}>
    <div className='col-2'></div>
    <div className='col-2'>
      {subCategories.map((subCategory, i) => <div className='d-flex pb-2' key={i} onMouseEnter={() => setSubCategory(i)}>
        <CustomLink to={subCategory.filters.length == 0 ? getLink(subCategory.link) : ''} text={subCategory.name[i18n?.language as string]} />
      </div>)}
    </div>
    <div className='col-4 border-start'>
      {subCategory > -1 && subCategories[subCategory].filters.map((filter, i) => <div className='d-flex pb-2' key={i}>
        <CustomLink
          to={getLink(subCategories[subCategory].link, filter.name.en)}
          text={filter.name[i18n?.language as string] + (
            subCategories[subCategory].link == 'Mattress/collection' && mattressColectionsPrice
            ?
            ` ${t('from')}: ${mattressColectionsPrice[filter.name.en].price[currency]} (${currency})`
            :
            ''
          )}
        />
      </div>)}
    </div>
    <div className='col-2'>
    </div>
  </div>
}