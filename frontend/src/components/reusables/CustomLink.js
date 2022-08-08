import React from "react";
import { Link } from "react-router-dom";
import { Hoverable } from "./Hoverable.js";

export default function CustomLink(props) {
  if (props.to == '') {
    return (
      <div className="no-hover no-link">
        <Hoverable text={props.text} />
      </div>
    );
  }

  let to = props.to.replace(/ /g, '_')
  to += location.search

  return (
    <Link className="no-hover no-link" to={to}>
      <Hoverable text={props.text}/>
    </Link>
  );
}
