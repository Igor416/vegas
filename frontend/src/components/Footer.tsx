import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import CustomLink from "./reusables/CustomLink";

export default function Footer() {
  const [t, i18n] = useTranslation('footer');
  const links = {
    "company": ["about", "story", "certificates", "materials", "jobs"],
    "store": ["shipping", "contacts", "reviews", "guarantee", "gifts"]
  }

  return (
    <div style={{ backgroundColor: 'var(--milk)' }} className="d-flex flex-column flex-sm-row container-fluid p-5">
      <div className="col-sm-2"></div>
      <div className="d-flex flex-column align-items-start col-sm-2">
        <span className="h5 mb-2">{t('company')}</span>
        {links.company.map((link, index) => {
        return (
          <CustomLink to={`/${'company'}/${link}`} key={index} text={t(link)}/>
        )})}
      </div>
      <div className="d-flex flex-column align-items-sm-start align-items-end col-sm-2">
        <span className="h5 mb-2">{t('store')}</span>
        {links.store.map((link, index) => {
        return (
          <CustomLink to={`/${'store'}/${link}`} key={index} text={t(link)}/>
        )})}
      </div>
      <div className="d-flex flex-column col-sm-2">
        <span className="h5 mb-2">{t('phone')}</span>
        <span>
          <FontAwesomeIcon icon="phone" /> &nbsp; 079 40-70-32
        </span>
        <span className="h5 my-2">{t('mail')}</span>
        <span>
          <FontAwesomeIcon icon="envelope" /> &nbsp; vegasmd.info@gmail.com
        </span>
        <span className="h5 my-2">{t('follow')}</span>
        <div className="row h5">
          <a target="_blank" href="https://www.facebook.com/MatrasyVegasMoldova/" className="link">
            <FontAwesomeIcon icon={['fab', 'facebook']} color="var(--deep-sky-blue)" />
          </a>
        </div>
      </div>
      <div className="col-sm-2"></div>
      <div className="col-sm-2"></div>
    </div>
  )
}