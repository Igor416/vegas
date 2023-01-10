import React from "react";

export default function CustomButton({color, text}) {
  return (
    <button style={{whiteSpace: 'nowrap'}} className={color + "-button outline-0 p-3 transition"}>
      <span>{text}</span>
    </button>
  );
}