import React from "react";

export default function Hoverable({text}) {

  return (
    <div className="hoverable">
      <span>{text}</span>
      <div className="mt-1 transition"></div>
    </div>
  )
}