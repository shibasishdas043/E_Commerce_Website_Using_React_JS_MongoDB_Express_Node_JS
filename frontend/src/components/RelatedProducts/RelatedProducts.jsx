import React, { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import "./RelatedProducts.css";
// import data_product from "../assets/Frontend_Assets/data";
import Item from "../Item/Item";

const RelatedProducts = ({ category }) => {
  const { all_product } = useContext(ShopContext);

  const related = all_product.filter((item) => item.category === category);

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {related.map((item, index) => {
          return (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
