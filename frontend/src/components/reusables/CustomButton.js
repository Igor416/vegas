import React from "react";

export default function CustomButton(props) {
  return (
    <button style={{whiteSpace: 'nowrap'}} className={props.color + "-button outline-0 p-3 transition"}>
      <span>{props.text}</span>
    </button>
  );
}
