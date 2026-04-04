import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../assets/Frontend_Assets/breadcrum_arrow.png";

const Breadcrums = (props) => {
  const { product } = props;

  if (!product) {
    return <div className="breadcrum">Loading....</div>;
  }

  return (
    <div className="breadcrum">
      Home <img src={arrow_icon} alt="" />
      Shop <img src={arrow_icon} alt="" />
      {product.category}
      <img src={arrow_icon} alt="" />
      {product.name}
    </div>
  );
};

export default Breadcrums;
