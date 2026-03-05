import React from 'react'
import { useContext } from 'react'
import { ShopContext } from "../context/ShopContext.jsx";
import Breadcrums from '../components/Breadcrums/Breadcrums.jsx';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay.jsx';
import { useParams } from "react-router-dom"; 

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((e) => e.id === Number(productId));



  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product}/>
    </div>
  )
}

export default Product