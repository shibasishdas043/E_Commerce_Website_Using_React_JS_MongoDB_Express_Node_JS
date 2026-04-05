import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../assets/Frontend_Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } =
    useContext(ShopContext);

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
              <div
                key={event.id}
                className="cartitems-format cartitems-format-main"
              >
                <img
                  className="carticon-product-icon"
                  src={event.image}
                  alt=""
                />
                <p>{event.name}</p>
                <p>${event.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[event.id]}
                </button>
                <p>${event.new_price * cartItems[event.id]}</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(event.id)}
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
              {/* </div> */}
            </div>
            <button>Proceed To Checkout</button>
          </div>
          <div className="cartitems-promocode">
            <p>*If You Have A Promo Code , Enter It Here</p>
            <div className="cartitems-promobox">
              <input type="text" name="" id="" placeholder="promo Code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
