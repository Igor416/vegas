import React from "react";
import Section from "./Section.js";

export default function Layout(props)  {
  let sorted_products = {};
  let filtering, remainder;
  
  for (let product of props.products) {
    filtering = product[props.category.default_filtering]
    if (filtering in sorted_products) {
      sorted_products[filtering].push(product)
    }
    else {
      sorted_products[filtering] = [product]
    }
  }
  
  for (let filtering in sorted_products) {
    remainder = sorted_products[filtering].length % 3 
    if (remainder != 0) {
      for (let i = 0; i < remainder + 1; i++) {
        sorted_products[filtering].push(null)
      }
    }
  }

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