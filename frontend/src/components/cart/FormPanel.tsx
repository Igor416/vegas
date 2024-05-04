import { ResponsiveProps, TranslatableProps } from "../.."
import { Order, OrderedProduct } from "../../JSONTypes"
import { CustomInput, CustomPhoneInput, CustomButton } from "../reusables"
import { useForm } from "../../hooks"
import { sendOrder } from "../../api"
import { useContext, useEffect } from "react"
import { CurrencyContext } from "../../providers"
import { useTotal } from "../../hooks/useTotal"

interface FormPanelProps extends ResponsiveProps, TranslatableProps {
  products: OrderedProduct[]
}

export function FormPanel({isMobile, t, lang, products}: FormPanelProps) {
  const {data, error, updateField, submitForm} = useForm(sendOrder)
  const currency = useContext(CurrencyContext)
  const total = useTotal(products, currency)

  useEffect(() => {
    updateField('products', products)
  }, [products])

  useEffect(() => {
    updateField('total', total + ` (${currency})`)
  }, [total, currency])

  return <div style={{border: isMobile ? '' : '1px solid var(--deep-sky-blue)'}} className='d-flex flex-column mt-5 p-0 p-sm-5'>
    <span className='h6 text-danger'>{error ? t('error') : ''}</span>
    <div className={(isMobile ? 'flex-column' : 'row-nowrap') + ' d-flex'}>
      <div className='d-flex col-sm-5 flex-column'>
        <div>
        {['name', 'town', 'address'].map((field, i) => <div key={i}>
          <label htmlFor={field}>{t(field)}</label>
          <CustomInput
            color='lime-green'
            className='px-0 mb-3 col-12'
            type='text'
            id={field}
            value={data[field as keyof Order]}
            onChange={value => updateField(field as keyof Order, value)}
          />
        </div>)}
        <CustomPhoneInput lang={lang as string} color='lime-green' phone={data.phone} setPhone={phone => updateField('phone', phone)} />
        </div>
      </div>
      {!isMobile && <div className='col-1'></div>}
      <div className='d-flex flex-column col-sm-3 mt-3 mt-sm-0'>
      {[1, 2, 3].map((num, i) => <div
        key={i}
        className='d-flex justify-content-start row-nowrap pb-3 mb-4'
        style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
      >
        <CustomInput
          color='none'
          className='me-3 w-auto'
          type='radio'
          id={'payment' + num}
          checked={t('payment' + num) === data.payment}
          value={t('payment' + num)}
          onChange={value => updateField('payment', t('payment' + num))}
        />
        <label htmlFor={'payment' + num}>{t('payment' + num)}</label>
      </div>)}
      </div>
      <div className='d-flex row-nowrap justify-content-end align-items-start col-sm-3 mt-3 mt-sm-0'>
        <div
          onClick={() => updateField('courier', 'yes')}
          style={{border: '1px solid var(--deep-sky-blue)', borderRight: 'none'}}
          className={(data.courier === 'yes' ? 'form-button-active' : 'form-button-unactive') + ' p-3 transition'}
        >
          <span>{t('courier')}</span>
        </div>
        <div
          onClick={() => updateField('courier', 'no')}
          style={{border: '1px solid var(--deep-sky-blue)', borderLeft: 'none'}}
          className={(data.courier != 'yes' ? 'form-button-active' : 'form-button-unactive') + ' p-3 transition'}
        >
          <span>{t('pickup')}</span>
        </div>
      </div>
    </div>
    <div className='d-flex justify-content-end mt-3 mt-sm-0' onClick={submitForm}>
      <CustomButton color='deep-sky-blue' text={t('submit')} />
    </div>
  </div>
}