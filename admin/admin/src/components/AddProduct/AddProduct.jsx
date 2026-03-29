import React from 'react'
import './AddProduct.css'

const AddProduct = () => {
  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input type="text" name="name" placeholder='type here'/>
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="text" name='old_price' aria-placeholder='type here'/>
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input type="text" name='new_price' aria-placeholder='type here'/>
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>product Category</p>
        <select className='add-product-selector' name="category">
          <option value="woman">
            Woman
          </option>
          <option value="men">
            Men
          </option>
          <option value="kid">
            Kid
          </option>
        </select>
      </div>
    </div>
  )
}

export default AddProduct