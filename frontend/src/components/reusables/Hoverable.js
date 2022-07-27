import React, { useState } from "react";
import { StyleSheet, css } from 'aphrodite'

const line = {
  backgroundColor: 'black',
  height: '1px'
}

const lineStyles = StyleSheet.create({
  hide: Object.assign({
    opacity: '0',
    width: '0%'
  }, line),
  show: Object.assign({
    opacity: '1',
    width: '100%'
  }, line)
})

export function Hoverable(props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <span>{props.text}</span>
      <div className={css(isActive ? lineStyles.show : lineStyles.hide) + " transition-s mt-1"}></div>
    </div>
  )
}

export function HoverableIcon(props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {props.icon}
      <div className={css(isActive ? lineStyles.show : lineStyles.hide) + " transition-s mt-1"}></div>
    </div>
  )
}