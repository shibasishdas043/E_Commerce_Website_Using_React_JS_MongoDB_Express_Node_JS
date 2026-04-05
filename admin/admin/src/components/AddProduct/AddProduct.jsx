import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/Admin_Assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(false);

  const imageHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const [productDetails, setproductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const changeHandler = (event) => {
    setproductDetails({
      ...productDetails,
      [event.target.name]: event.target.value,
    });
  };

  // const addProduct = async () => {
  //   console.log(productDetails);
  //   let responseData;
  //   let formData = new FormData();
  //   let product = productDetails;
  //   formData.append("product", image);

  //   await fetch("http://localhost:4000/upload", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //     body: formData,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       responseData = data;
  //     });

  //   if (responseData.success) {
  //     product.image = responseData.image_url;
  //     console.log(product);
  //     await fetch("http://localhost:4000/addproduct", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(product),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         data.success ? alert("Product Added") : alert("Failed");
  //       });
  //   }
  // };

  const addProduct = async () => {
    console.log(productDetails);
    let responseData;

    // FIX 1: Use capital "F" for FormData
    let formData = new FormData();
    formData.append("product", image);

    try {
      // FIX 2: Use await consistently for the image upload
      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      responseData = await uploadResponse.json();

      if (responseData.success) {
        // FIX 3: Create a copy of the object instead of mutating state directly
        let product = { ...productDetails };
        product.image = responseData.image_url;

        console.log(product);

        // FIX 4: Corrected "headers" (plural) and "Application/json" (spelling)
        const addResponse = await fetch(`${import.meta.env.VITE_API_URL}/addproduct`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        const finalData = await addResponse.json();

        if (finalData.success) {
          alert("Product Added Successfully!");
          // Optional: Reset state here if you want to clear the form
        } else {
          alert("Failed to add product to database");
        }
      }
    } catch (error) {
      console.error("Error during product submission:", error);
      alert("An error occurred. Check the console.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          className="add-product-selector"
          name="category"
        >
          <option value="women">Woman</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            className="addproduct-thumbnail-img"
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={addProduct} className="addproduct-btn">
        Add
      </button>
    </div>
  );
};

export default AddProduct;
