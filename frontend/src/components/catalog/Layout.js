import React from "react";
import Section from "./Section.js";

export default function Layout(props)  {
  let sorted_products = sortProducts(props.products, props.category.default_filtering);

  return (
    <div className="py-4">
    {Object.keys(sorted_products).map((filtering, index) => {
    return (
      <div key={index}>
        <Section {...props} products={sorted_products[filtering]} filtering={filtering} />
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
    if (remainder != 0) {
      for (let i = 0; i < remainder + 1; i++) {
        sorted[filtering].push(null)
      }
    }
  }

  return sorted
}