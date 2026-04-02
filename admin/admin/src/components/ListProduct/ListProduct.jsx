// import React, { useEffect, useState } from "react";
// import "./ListProduct.css";
// import cross_icon from "../../assets/Admin_Assets/cross_icon.png";

// const ListProduct = () => {
//   const [allproducts, setAllproducts] = useState([]);

//   const fetchInfo = async () => {
//     await fetch("http://localhost:4000/allproducts")
//       .then((response) => response.json())
//       .then((data) => {
//         setAllproducts(data);
//       });
//   };

//   useEffect(() => {
//     fetchInfo();
//   }, []);

//   return (
//     <>
//       <div className="list-product">
//         <h1>All Products List</h1>
//         <div className="listproducts-format-name">
//           <p>Product</p>
//           <p>Title</p>
//           <p>Old Price</p>
//           <p>new Price</p>
//           <p>Category</p>
//           <p>Remove</p>
//         </div>
//         <div className="listproducts-allproducts">
//           <hr />
//           {allproducts.map((product, index) => {
//             return (
//               <div
//                 key={index}
//                 className="listproduct-format-name listproduct-format"
//               >
//                 <img src={product.image} alt="" className="listproduct-icon" />
//                 <p>{product.name}</p>
//                 <p>${product.old_price}</p>
//                 <p>${product.new_price}</p>
//                 <p>{product.category}</p>
//                 <img
//                   className="listproduct-remove-icon"
//                   src={cross_icon}
//                   alt=""
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <hr />
//     </>
//   );
// };

// export default ListProduct;

// import React, { useEffect, useState } from "react";
// import "./ListProduct.css";
// import cross_icon from "../../assets/Admin_Assets/cross_icon.png";

// const ListProduct = (id) => {
//   const [allproducts, setAllproducts] = useState([]);

//   const remove_product = async () => {
//     await fetch("http://localhost:4000/removeproduct", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({ id: id }),
//     });
//   };

//   useEffect(() => {
//     const fetchInfo = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/allproducts");
//         const data = await response.json();
//         setAllproducts(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchInfo();
//   }, []); // Empty dependency array is now safe because fetchInfo is defined inside

//   const removeProduct = async (id) => {
//     // Logic for deleting a product would go here
//     console.log("Delete product ID:", id);
//     await fetchInfo();
//   };

//   return (
//     <div className="list-product">
//       <h1>All Products List</h1>

//       {/* Header Row */}
//       <div className="listproduct-format-main listproduct-header">
//         <p>Product</p>
//         <p>Title</p>
//         <p>Old Price</p>
//         <p>New Price</p>
//         <p>Category</p>
//         <p>Remove</p>
//       </div>

//       <div className="listproduct-allproducts">
//         <hr />
//         {allproducts.map((product, index) => {
//           return (
//             <React.Fragment key={index}>
//               <div className="listproduct-format-main listproduct-format">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="listproduct-product-icon"
//                 />
//                 <p>{product.name}</p>
//                 <p>${product.old_price}</p>
//                 <p>${product.new_price}</p>
//                 <p>{product.category}</p>
//                 <img
//                   onClick={() => removeProduct(product.id)}
//                   className="listproduct-remove-icon"
//                   src={cross_icon}
//                   alt="remove"
//                 />
//               </div>
//               <hr />
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ListProduct;

import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/Admin_Assets/cross_icon.png";

const ListProduct = () => {
  const [allproducts, setAllproducts] = useState([]);

  // 1. Define fetchInfo outside so both useEffect and removeProduct can use it
  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/allproducts");
      const data = await response.json();
      setAllproducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // 2. Consolidate into one working removal function
  const removeProduct = async (id) => {
    await fetch("http://localhost:4000/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    // 3. Refresh the list after deleting
    await fetchInfo();
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>

      <div className="listproduct-format-main listproduct-header">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <React.Fragment key={index}>
              <div className="listproduct-format-main listproduct-format">
                <img
                  src={product.image}
                  alt={product.name}
                  className="listproduct-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  onClick={() => removeProduct(product.id)}
                  className="listproduct-remove-icon"
                  src={cross_icon}
                  alt="remove"
                />
              </div>
              <hr />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
