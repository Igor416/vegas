import React from "react";

export default function Technologies(props) {
  const technologies = props.product.technologies

  return (
    <div className="d-flex flex-column">
    {technologies.map((technology, index) => {
    return (
      <div key={index} className="d-flex row-nowrap border-bottom py-4">
        <div className="d-flex align-items-center justify-content-center col-2">
          <img className="w-75" src={technology.image} />
        </div>
        <div className="col-10 d-flex flex-column">
          <div style={{color: 'var(--deep-sky-blue)'}} className="h5">
            <span>{technology.name}</span>
          </div>
          <div>
            <span>{technology.desc}</span>
          </div>
        </div>
      </div>
    )})}
    </div>
  );
}
