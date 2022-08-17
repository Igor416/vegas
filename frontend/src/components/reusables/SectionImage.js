import React from "react";

export default function SectionImage({category}) {
  return (
    <div
      className="container-fluid m-0 p-0 d-flex flex-column justify-content-around align-items-center"
      style={{ background: `url(/static/images/${category.name}.jpg) no-repeat center center fixed` }}
    >
      <div className="container" style={{height: '30vh'}}></div>
      <div
        className="container text-dark d-flex flex-column justify-content-center align-items-center"
        style={{
          height: '30vh'
        }}>
        <span className="h4">{category.name_pl}</span>
        <span className="text-center">{category.desc}</span>
      </div>
    </div>
  );
}