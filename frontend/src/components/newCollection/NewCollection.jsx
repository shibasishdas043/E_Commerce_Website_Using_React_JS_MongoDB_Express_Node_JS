import React, { useEffect, useState } from "react";
import "./NewCollection.css";
// import new_collection from '../assets/Frontend_Assets/new_collections';
import Item from "../Item/Item";

const NewCollection = () => {
  const [newcollection, setnewCollection] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/newcollections")
      .then((response) => response.json())
      .then((data) => setnewCollection(data));
  }, []);

  return (
    <div className="newcollection">
      <h1>New Collections</h1>
      <hr />
      <div className="collections">
        {newcollection.map((item, index) => {
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

export default NewCollection;
