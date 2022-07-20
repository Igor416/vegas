import React from "react";
import { Link } from "react-router-dom";
import Hoverable from "./Hoverable.js";

export default function CustomLink(props) {
  if (props.link == '') {
    return (
      <div className="no-hover no-link">
        <Hoverable text={props.text} />
      </div>
    );
  }

  let href = props.link
  
  if (props.menu_link) {
    href += '/' + props.text.replace(/ /g, '_')
  }
  
  href += location.search

  return (
    <Link className="no-hover no-link" to={href}>
      <Hoverable text={props.text} />
    </Link>
  );
}
