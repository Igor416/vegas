import React from "react";
import { StyleSheet, css } from 'aphrodite'

const buttonStyles = StyleSheet.create({
  limeGreen: {
    color: 'var(--lime-green)',
    border: '1px solid var(--lime-green)',
    backgroundColor: 'white',
    ':hover': {
      color: 'white',
      backgroundColor: 'var(--lime-green)'
    }
  },
  darkCyan: {
    color: 'var(--dark-cyan)',
    border: '1px solid var(--dark-cyan)',
    backgroundColor: 'white',
    ':hover': {
      color: 'white',
      backgroundColor: 'var(--dark-cyan)',
    }
  },
  deepSkyBlue: {
    color: 'var(--deep-sky-blue)',
    border: '1px solid var(--deep-sky-blue)',
    backgroundColor: 'white',
    ':hover': {
      color: 'white',
      backgroundColor: 'var(--deep-sky-blue)',
    }
  }
})

export default function CustomButton(props) {
  return (
    <button style={{whiteSpace: 'nowrap'}} className={css(buttonStyles[props.color]) + " outline-0 p-3 transition-s"}>
      <span>{props.text}</span>
    </button>
  );
}
