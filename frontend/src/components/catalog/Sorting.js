import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyleSheet, css } from 'aphrodite';

const switchMenu = {
  display: 'flex',
  padding: '0.5vw',
  width: '3vw',
  height: '3vw',
  backgroundColor: 'var(--blue)'
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

const bar = {
  backgroundColor: 'white'
}

const barStyles = StyleSheet.create({
  column: Object.assign({
    height: '1vh',
    width: '2vw'
  }, bar),
  grid: Object.assign({
    height: '0.75vw',
    width: '0.75vw'
  }, bar)
})

export default class Sorting extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let isGrid = this.props.gridView;

    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-start">
          <div>
            <span>Сортировать по:</span>
          </div>
          <div>
            <span className="px-3">
              Умолчанию
              &nbsp;
              <FontAwesomeIcon icon='angle-down' />
              &nbsp;
              <FontAwesomeIcon icon='angle-up' />
            </span>
          </div>
          <div>
            <span className="px-3">
              Цене
              &nbsp;
              <FontAwesomeIcon icon='angle-down' />
              &nbsp;
              <FontAwesomeIcon icon='angle-up' />
            </span>
          </div>
          <div>
            <span className="ps-3">
              Популярности
              &nbsp;
              <FontAwesomeIcon icon='angle-down' />
              &nbsp;
              <FontAwesomeIcon icon='angle-up' />
            </span>
          </div>
        </div>
        <div>
          <div
            onClick={this.props.changeLayout}
            className={css(isGrid ? switchStyles.grid : switchStyles.column) + ' transition-s'}>
            {[0, 1, 2].map((value) => {
              return <div
              key={value}
              className={css(isGrid ? barStyles.grid : barStyles.column) + ' transition-s'}
              ></div>
            })}
          </div>
        </div>
      </div>
    );
  }
}
