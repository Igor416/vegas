import React from "react";
import MattressLayout from "./layouts/MattressLayout.js";

export default function LayoutManager(props) {
  const components = {
    Mattress: MattressLayout
  };
  const LayoutName = components[props.category_name];
  return <LayoutName {...props}/>
}