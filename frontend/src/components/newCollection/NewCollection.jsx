import React from 'react'
import "./NewCollection.css";
import new_collection from '../assets/Frontend_Assets/new_collections';
import Item from '../Item/item';

const NewCollection = () => {
  return (
    <div className='newcollection'>
      <h1>New Collections</h1>
      <hr />
      <div className="collections">
        {
          new_collection.map((item, index) => {
            return (
              <Item
                key={index}
                id={item.id}
                name={item.name}
                image={item.image}
                new_prices={item.new_price}
                old_prices={item.old_price}
              />
            );
          })
        }
      </div>
    </div>
  )
}

export default NewCollection