import React from "react";

export default function SectionImage({category}) {
  return (
    <div className="container-fluid m-0 mt-5 p-0 d-flex flex-column justify-content-around align-items-center">
      <div className="w-100" style={{height: '5vh'}} />
      <img src={`/static/images/${category.name}.jpg`} style={{width: '100vw'}} />
    </div>
  );
}