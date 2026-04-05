const backendUrl = import.meta.env.VITE_API_URL;
import React, { useEffect, useState } from "react";
import "./Popular.css";
// import data_product from "../assets/Frontend_Assets/data.js";
import Item from "../Item/Item.jsx";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/popularinwoman`)
      .then((response) => response.json())
      .then((data) => setPopularProducts(data));
  }, []);

  return (
    <div className="popular">
      <h1>Popular In Women</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, index) => {
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

export default Popular;
