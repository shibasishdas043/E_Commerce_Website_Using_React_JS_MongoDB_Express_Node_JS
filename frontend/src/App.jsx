import React from "react";
// import './Index.css'
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shop from "./pages/Shop";
import ShopCatagory from "./pages/ShopCatagory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import LoginSignup from "./pages/LoginSignup";
import Footer from "./components/Footer/Footer.jsx";
import mens_banner from "./components/assets/Frontend_Assets/banner_mens.png";
import women_banner from "./components/assets/Frontend_Assets/banner_women.png";
import kids_banner from "./components/assets/Frontend_Assets/banner_kids.png";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route
            path="/mens"
            element={<ShopCatagory catagory={"men"} banner={mens_banner} />}
          />
          <Route
            path="/womans"
            element={<ShopCatagory catagory={"women"} banner={women_banner} />}
          />
          <Route
            path="/kids"
            element={<ShopCatagory catagory={"kid"} banner={kids_banner} />}
          />
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
