import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from "react-i18next";

import { links } from "./reusables/Globals.js";
import CustomLink from "./reusables/CustomLink.js";

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const t = this.props.t
    return (
      <div style={{ backgroundColor: 'var(--milk)' }} className="d-flex container-fluid p-5">
        <div className="col-2"></div>
        {Object.keys(links).map((section, index) => {
        return (
        <div key={index} className="d-flex flex-column align-items-start col-2">
          <span className="h5 mb-2">{t(section)}</span>
          {links[section].map((link, index) => {
          return (
            <CustomLink to={`/${section}/${link}`} key={index} text={t(link)}/>
          )})}
        </div>
        )})}
        <div className="d-flex flex-column col-2">
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
        <div className="col-2">
          <span>
            
          </span>
        </div>
        <div className="col-2"></div>
      </div>
    );
  }
}

export default withTranslation('footer')(Footer);