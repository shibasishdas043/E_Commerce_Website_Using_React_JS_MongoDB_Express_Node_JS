import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../assets/Frontend_Assets/cart_cross_icon.png";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart } = useContext(ShopContext);

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((event) => {
        if (cartItems[event.id] > 0) {
          return (
            <div>
              <div className="cartitems-format">
                <img
                  className="carticon-product-icon"
                  src={event.image}
                  alt=""
                />
                <p>{event.name}</p>
                <p>{event.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[event.id]}
                </button>
                <p>{event.new_price * cartItems[event.id]}</p>
                <img
                  src={remove_icon}
                  onClick={() => removeFromCart(event.id)}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
      })}
    </div>
  );
};

export default CartItems;
