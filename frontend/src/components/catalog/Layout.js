import React from "react";
import Section from "./Section.js";

export default function Layout(props)  {
    let products = sortProducts(props.products, props.category.default_filtering);

    return (
      <div className="py-4">
        {Object.keys(products).map((filtering, index) => {
        return (
          <div key={index}>
            <Section
              products={products}
              filtering={filtering}
              isGrid={props.isGrid}
              currency={props.currency}
              lang={props.lang}
              category={props.category} 
            />
          </div>
        )})}
      </div>
    );
}

function sortProducts(products, default_filtering) {
  let sorted = {};
  let filtering, remainder;
  
  for (let product of products) {
    filtering = product[default_filtering]
    if (filtering in sorted) {
      sorted[filtering].push(product)
    }
    else {
      sorted[filtering] = [product]
    }
  }
  
  for (let filtering in sorted) {
    remainder = sorted[filtering].length % 3 
    if (remainder == 0) continue
    else {
      for (let i = 0; i < remainder + 1; i++) {
        sorted[filtering].push(null)
      }
    }
  }

  return sorted
}