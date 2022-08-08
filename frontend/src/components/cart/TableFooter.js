import React from "react";
import { Link } from "react-router-dom";
import CustomButton from '../reusables/CustomButton.js';

export default function TableFooter(props)  {
  const translations = {
    en: {
      add: 'Add more',
    },
    ru: {
      add: 'Добавить еще',
    },
    ro: {
      add: 'Adăuga mai mult',
    }
  }

  const lang_version = translations[props.lang]

  return (
    <div className="row text-center">
      <Link to={"/" + location.search} className="d-flex justify-content-center no-link col-2 pt-3 border-end">
        <CustomButton text={lang_version.add} color="limeGreen"/>
      </Link>
      <div className="col-9 border-end"></div>
      <div style={{ color: 'var(--deep-sky-blue)' }} className="col-1 d-flex justify-content-center align-items-center h5 m-0">
        <span>{props.total} ({props.currency})</span>
      </div>
    </div>
  );
}