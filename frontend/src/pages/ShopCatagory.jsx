import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import dropdown_icon from "../components/assets/Frontend_Assets/dropdown_icon.png";
import Item from "../components/Item/item";
import "./CSS/ShopCatagory.css";

const ShopCatagory = ({ catagory, banner }) => {
  const { all_product } = useContext(ShopContext);

  return (
    <div className="ShopCatagory">
      <img className="shopcatagory-banner" src={banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span>out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort By <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((product, index) => {
          if (catagory === product.category) {
            return (
              <Item
                key={index}
                id={product.id}
                name={product.name}
                image={product.image}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCatagory;
