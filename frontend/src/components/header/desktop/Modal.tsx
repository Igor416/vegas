import { useEffect, useState } from "react";
import { TranslatableProps } from "../../..";
import { sendProductHelp } from "../../../api";
import { useForm } from "../../../hooks";
import { CustomInput, CustomPhoneInput, CustomButton } from "../../reusables";

export function Modal({t, lang}: TranslatableProps) {
  const {data, error, response, updateField, updateFields, submitForm} = useForm(sendProductHelp)
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    if (!ordered) {
      updateField('name', '')
    }
  }, [ordered])

  useEffect(() => {
    $(function () {
      $('#modal').modal('toggle');
    });
  }, [response])

  return <div className='modal fade' id='modalHelp' tabIndex={-1}>
    <div className='modal-dialog'>
      <div className='modal-content'>
        <div className='modal-header'>
          <div>
            <span className='h3'>{t('credit')}</span>
            <br/>
            <span>({t('procent')})</span>
          </div>
          <button onClick={() => setOrdered(false)} type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
        </div>
        <div className='modal-body h6'>
          <ol>
            <li>Maib - LiberCard (6 {t('months')})</li>
            <li>Start Credit (4-6 {t('months')})</li>
          </ol>
          <span className='h6 text-danger'>{error ? t('error') : ''}</span>
          <form style={{display: ordered ? 'block' : 'none'}} className='mt-3'>
            <label htmlFor='name'>{t('name')}</label>
            <br/>
            <CustomInput
              color='dark-cyan'
              className='px-0 mb-3'
              type='text'
              id='name'
              value={data.name}
              onChange={value => updateField('name', value)}
            />
            <CustomPhoneInput
              lang={lang as string}
              color='dark-cyan' 
              phone={data.phone}
              setPhone={phone => updateField('phone', phone)}
            />
          </form>
        </div>
        <div className='d-flex justify-content-between modal-footer'>
          <div onClick={() => setOrdered(false)} data-bs-dismiss='modal'>
            <CustomButton color='lime-green' text={t('close')} />
          </div>
          {ordered
          ?
          <div onClick={submitForm}>
            <CustomButton color='deep-sky-blue' text={t('submit')} />
          </div>
          :
          <div onClick={() => setOrdered(true)}>
            <CustomButton color='deep-sky-blue' text={t('call')} />
          </div>
          }
        </div>
      </div>
    </div>
  </div>
}