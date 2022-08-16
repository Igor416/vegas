import React from "react";
import { Link } from "react-router-dom";
import Hoverable from "./Hoverable.js";

export default function CustomLink({to, text}) {
  if (to == '') {
    return (
      <div className="no-hover no-link">
        <Hoverable text={text} />
      </div>
    );
  }

  to = to.replace(/ /g, '_') + location.search

  return (
    <Link className="no-hover no-link" to={to}>
      <Hoverable text={text}/>
    </Link>
  );
}
