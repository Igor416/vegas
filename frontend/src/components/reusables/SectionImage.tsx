import React from "react";

import { Category } from "./JSONTypes";

interface SectionImageProps {
  category: Category,
  collection?: string
}

export default function SectionImage({category, collection}: SectionImageProps) {
  if (collection) {return (
    <div className="container-fluid row" style={{marginTop: '5vh'}}>
      <div className="col-1"></div>
      <img className="col-10" src={`/static/images/${collection ? collection : category.name}.${collection ? 'png' : 'jpg'}`} />
      <div className="col-1"></div>
    </div>
  )} else {return (
    <div className="container-fluid m-0 mt-5 p-0 d-flex flex-column justify-content-around align-items-center">
      <div className="w-100" style={{height: '5vh'}} />
      <img src={`/static/images/${category.name}.jpg`} style={{width: '100vw'}} />
    </div>
  )};
}