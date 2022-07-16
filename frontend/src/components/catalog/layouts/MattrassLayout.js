import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class MattrassLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let mattrasses = sortMattrasses(this.props.products)
    console.log(Object.keys(mattrasses))
    let isGrid = this.props.gridView
    return (
      <div>
        {Object.keys(mattrasses).map((index, collection) => {
          return (
            <div
              key={index}
            >
              <span>Коллекция {collection}</span>
              <div>
                {mattrasses[collection].map((index, mattrass) => {
                  <Link to={`/product/${mattrass.id}`}>
                    <div>
                      <div></div>
                      <div>
                        <img src={`/static/images/${mattrass.name}.jpg`}/>
                      </div>
                      <div>
                        <div>
                          <span>Матрас {mattrass.name}</span>
                        </div>
                        <div>
                          <span>от {mattrass.sizes[0].priceMDL}</span>
                        </div>
                        <div>
                          Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum Lorem IpsumLorem Ipsum Lorem Ipsum Lorem Ipsum
                        </div>
                      </div>
                    </div>
                  </Link>
                })}
              </div>
            </div>
          )
        })}
      </div>
    );
  }
}

function sortMattrasses(mattrasses) {
  let sorted = {};
  let collection;

  for (let mattrass of mattrasses) {
    collection = mattrass.collection
    if (collection in sorted) {
      sorted.collection.push(mattrass)
    }
    else {
      sorted.collection = []
    }
  }

  return sorted
}