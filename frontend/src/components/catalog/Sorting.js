import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';
import { Hoverable, HoverableIcon } from '../reusables/Hoverable.js';
import { currencies } from '../reusables/Globals.js';

const switchMenu = {
  padding: '0.5vw',
  width: '3vw',
  height: '3vw',
  backgroundColor: 'var(--dark-cyan)'
}

const switchStyles = StyleSheet.create({
  column: Object.assign({
    flexFlow: 'column nowrap',
    gap: '1vh'
  }, switchMenu),
  grid: Object.assign({
    flexFlow: 'row wrap',
    gap: '0.5vw'
  }, switchMenu)
})

const barStyles = StyleSheet.create({
  column: {
    height: '1vh',
    width: '2vw'
  },
  grid: {
    height: '0.75vw',
    width: '0.75vw'
  }
})

export default function Sorting(props) {
  const translations = {
    en: {
      sort_by: 'Sort by: ',
      filters: ['Default', 'Price', 'Popularity']
    },
    ru: {
      sort_by: 'Сортировать по: ',
      filters: ['Умолчанию', 'Цене', 'Популярности']
    },
    ro: {
      sort_by: 'Filtrează după: ',
      filters: ['Implicit', 'Preț', 'Popularitate']
    }
  }

  const lang_version = translations[props.lang]
  
  return (
    <div className="d-flex justify-content-between align-items-center h6">
      <div className="d-flex justify-start">
        <div>
          <span>{lang_version.sort_by}</span>
        </div>
        {lang_version.filters.map((filter, index) => {
        return (
        <div key={index} className="d-flex flex-row px-3">
          <span>
            {filter}
          </span>
          <span className="mx-2">
            <HoverableIcon icon={<FontAwesomeIcon icon='angle-down' />} />
          </span>
          <span>
            <HoverableIcon icon={<FontAwesomeIcon icon='angle-up' />} />
          </span>
        </div>
        )})}
      </div>
      <div className="d-flex flex-row align-items-center">
        <div className="d-flex flex-row me-5 align-items-center">
          {currencies.map((currency, index) => {
          return (
            <div
              onClick={() => props.updateCurrency(currency)}
              className={"d-flex flex-row " + (currency != props.currency && "link")}
              key={index}
            >
              <Hoverable text={currency} isActive={currency == props.currency}/>
              <span>&nbsp;</span>
            </div>
          )})}
        </div>
        <div
          onClick={props.changeLayout}
          className={css(props.isGrid ? switchStyles.grid : switchStyles.column) + ' d-flex transition'}>
          {[0, 1, 2].map((value) => {
          return <div key={value} className={css(props.isGrid ? barStyles.grid : barStyles.column) + ' bg-white transition'} />
          })}
        </div>
      </div>
    </div>
  );
}
