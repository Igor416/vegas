import React, { useState } from "react";

export default function Hoverable(props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <span>{props.text}</span>
      <div className={"line-" + (isActive ? "show" : "hide") + " line transition mt-1"}></div>
    </div>
  )
}