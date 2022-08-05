import React from "react";

export default function Structure(props) {
  const structureRaw = props.product.structure
  const structure = []

  for (let layerRaw of structureRaw) {
    let contains = false
    for (let layer of structure) {
      if (layerRaw.name == layer.name) {
        contains = true
      }
    }
    if (!contains) {
      layerRaw.quantity = layerRaw.technologies[0]
      structure.push(layerRaw)
    }
    else {
      let sameLayers = structureRaw.filter(layer => layer.name == layerRaw.name)
      layerRaw.quantity = layerRaw.technologies[sameLayers.indexOf(layerRaw)]
      structure.push(layerRaw)
    }
  }
  /*
  structureRaw comes with a list of quantities called technologies, with index of quantity corresponding index of same layers.
  So we append layer if it is new, or append quantity with new set id
  */
  return (
    <div className="d-flex flex-column">
    {structure.map((layer, index) => {
    return (
      <div key={index} className="row border-bottom py-4">
        <div style={{color: 'var(--deep-sky-blue)'}} className="col-2 h5">
          <span>{layer.name}</span>
        </div>
        <div className="col-2 d-flex align-items-center">
          <div
            style={{
              color: 'white',
              backgroundColor: 'var(--deep-sky-blue)',
              width: '1.5vw',
              height: '1.5vw',
              marginLeft: '-0.75vw'
            }}
            className="rounded-circle d-flex align-items-center justify-content-center position-absolute">
            <span>{layer.quantity}</span>
          </div>
          <img src={layer.image} />
        </div>
        <div className="col-8">
          <span>{layer.desc}</span>
        </div>
      </div>
    )})}
    </div>
  );
}
