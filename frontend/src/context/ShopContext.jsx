import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const backendUrl = import.meta.env.VITE_API_URL;

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 301; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeShop = async () => {
      try {
        const productRes = await fetch(`${backendUrl}/allproducts`);
        if (!productRes.ok)
          throw new Error(`Products fetch failed: ${productRes.status}`);
        const productData = await productRes.json();
        setAll_product(productData);
      } catch (err) {
        console.error("❌ Failed to load products:", err.message);
        setError("Could not load products. Please refresh the page.");
      }

      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const cartRes = await fetch(`${backendUrl}/getcart`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "auth-token": token,
              "Content-Type": "application/json",
            },
            body: "",
          });

          if (!cartRes.ok)
            throw new Error(`Cart fetch failed: ${cartRes.status}`);
          const cartData = await cartRes.json();
          setCartItems(cartData);
        } catch (err) {
          console.error("❌ Failed to load cart:", err.message);
        }
      }

      setLoading(false);
    };

    initializeShop();
  }, []);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        const res = await fetch(`${backendUrl}/addtocart`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        });

        if (!res.ok) throw new Error(`Add to cart failed: ${res.status}`);
        const data = await res.json();
        console.log("🛒 Added to cart:", data);
      } catch (err) {
        console.error("❌ Add to cart error:", err.message);
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        const res = await fetch(`${backendUrl}/removefromcart`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        });

        if (!res.ok) throw new Error(`Remove from cart failed: ${res.status}`);
        const data = await res.json();
        console.log("🗑️ Removed from cart:", data);
      } catch (err) {
        console.error("❌ Remove from cart error:", err.message);
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find(
          (product) => product.id === Number(item),
        );
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    loading,
    error,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
