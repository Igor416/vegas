import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from "react-i18next";
import CustomLink from "./reusables/CustomLink.js";
import { links } from "./reusables/Globals.js";

class MobileFooter extends Component {
  constructor(props) {
    super(props);

    this.links = {
      "company": ["about", "story", "certificates", "materials", "jobs"],
      "store": ["shipping", "contacts", "reviews", "guarantee", "gifts"]
    }
  }

  render() {
    const t = this.props.t
    return (
      <div style={{ borderTop: '1px solid var(--deep-sky-blue)'}} className="d-flex flex-column container-fluid p-5">
        {Object.keys(links).map((section, index) => {
        return (
        <div key={index} className={"d-flex flex-column p-2" + (index == 1 ? " align-items-end" : " align-items-start")}>
          <span className="h5 mb-2">{t(section)}</span>
          {links[section].map((link, index) => {
          return (
            <CustomLink to={`/${section}/${link}`} key={index} text={t(link)}/>
          )})}
        </div>
        )})}
        <div className="d-flex flex-column p-2">
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
        <div className="border-top p-2 text-end">
          <span>
            © 2022 ООО «ЛидерМатрасМаркет», ул. Клары Цеткин, 24, пом. 2,<br />
            Минск, 220004.<br />
            УНП 190812427<br />
            Свидетельство No 452, от 07.03.2007г.<br />
            Выдано: Минским городским исполнительным комитетом<br />
            Интернет-магазин vegas.by - Регистрация. в ТР №185812 от 03.02.2015 г.
          </span>
        </div>
      </div>
    );
  }
}

export default withTranslation('footer')(MobileFooter);