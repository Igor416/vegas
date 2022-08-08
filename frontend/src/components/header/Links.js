import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import CustomLink from '../reusables/CustomLink.js';

const angleStyles = StyleSheet.create({
  hide: {
    transform: 'rotate(0deg)'
  },
  show: {
    transform: 'rotate(180deg)'
  }
})

export default function Links(props) {
  const translations = {
    en: 'HOME',
    ru: 'ГЛАВНАЯ',
    ro: 'ACASA'
  }
  
  const lang_version = translations[props.lang]
    
  return (
    <div className="row px-5 pt-4">
      <div className="col-1"></div>
      <div className="col-10 h6 m-0">
        <div
          className="d-flex flex-inline justify-content-between transition-s"
        >
          <div>
            <CustomLink to='/' text={lang_version} />
          </div>
          {Object.keys(props.categories).map((category, index) => {
          return (
            <div
              className="d-flex flex-row pb-2"
              key={index}
              onMouseEnter={() => props.onMouseEnter(false, category)}
              onMouseLeave={() => props.onMouseLeave()}
            >
              <CustomLink to='' text={category} />
              <div>
                <span>
                  &nbsp;
                  <FontAwesomeIcon className={css(props.state.category == category ? angleStyles.show : angleStyles.hide) + " transition-s"} icon='angle-down' /> 
                </span>
              </div>
            </div>
          )})}
        </div>
      </div>
      <div className="col-1"></div>
    </div>
  );
}

