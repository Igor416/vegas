import { useCallback, useEffect } from "react";
import { TranslatableProps } from "../..";
import { ListProduct } from "../../JSONTypes";
import { CustomInput, CustomPhoneInput, CustomButton } from "../reusables";
import { sendProductHelp } from "../../api";
import { useForm } from "../../hooks";

interface ModalProps extends TranslatableProps {
  active?: ListProduct
}

export function Modal({t, lang, active}: ModalProps) {
  const {data, error, response, updateField, updateFields, submitForm} = useForm(sendProductHelp)
  useEffect(() => {
    $(function () {
      $('#modal').modal('hide');
    });
  }, [])

  useEffect(() => {
    if (response) {
      $(function () {
        $('#modal').modal('hide');
      });
    }
  }, [response])
  
  useEffect(() => {
    if (active) {
      updateFields(['category', 'product'], [active.category.name_s, active.name])
    }
  }, [active])

  return <div className='modal fade' id='modalDetails' tabIndex={-1}>
    <div className='modal-dialog'>
      <div className='modal-content'>
        <div className='modal-header'>
          <span className='modal-title h5'>{t('call') + ` (${active?.name})`}</span>
          <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
        </div>
        <div className='modal-body'>
          <span>{t('desc')}</span>
          <br/>
          <span className='h6 text-danger'>{error ? t('error') : ''}</span>
          <form className='mt-3'>
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
          <div data-bs-dismiss='modal'>
            <CustomButton color='lime-green' text={t('close')} />
          </div>
          <div onClick={submitForm}>
            <CustomButton color='deep-sky-blue' text={t('submit')} />
          </div>
        </div>
      </div>
    </div>
  </div>
}