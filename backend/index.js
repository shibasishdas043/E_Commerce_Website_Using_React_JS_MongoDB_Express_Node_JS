const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
// const connectDB = require("./config/dBconfig.js");

app.use(express.json());
app.use(cors());

// mongodb+srv://shibasishdas043_db_user:<db_password>@cluster0.si9gkky.mongodb.net/

mongoose.connect(
  // "mongodb+srv://shiba2026:@Shiba#2026@cluster0.4jzsdux.mongodb.net/?appName=Cluster0",
  "mongodb://localhost:27017/",
  // "mongodb+srv://anid19631_db_user:2uFoe97WKB403jpF@cluster0.qqreqmg.mongodb.net/?appName=Cluster0",
);
// try {
//   console.log("connected to db")
// } catch (error) {

// }
// try(() => {
//   console.log("Successfully connected to MongoDB");
// })
// catch((err) => {
//   console.error("MongoDB Connection Error: ", err.message);
// });

//API Creation

app.get("/", (request, response) => {
  response.send("Express App is Running");
});

//Image storage engine

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (request, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage: storage,
});

//creating upload endpoint for images

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (request, response) => {
  response.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${request.file.filename}`,
  });
});

//schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// **make schema in this format**
// {
//   "id": 1,
//   "name": "Classic Cotton T-Shirt",
//   "image": "http://localhost:4000/images/product_12345.png",
//   "category": "men",
//   "new_price": 25,
//   "old_price": 30
// }

app.post("/addproduct", async (request, response) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  // const product = new Product({
  //   id: request.body.id,
  //   name: request.body.name,
  //   image: request.body.image,
  //   category: request.body.category,
  //   new_price: request.body.new_price,
  //   old_price: request.body.old_price,
  // });

  const product = new Product({
    id: id, // Use the 'id' variable you calculated above
    name: request.body.name,
    image: request.body.image,
    category: request.body.category,
    new_price: request.body.new_price,
    old_price: request.body.old_price,
  });

  console.log(product);
  await product.save();
  console.log("Saved");
  response.json({
    success: true,
    name: request.body.name,
  });
});

//creating api for deleting products

app.post("/removeproduct", async (request, response) => {
  await Product.findOneAndDelete({ id: request.body.id });
  console.log("Remove");
  response.json({
    success: true,
    name: request.body.name,
  });
});

//creating api for getting all products

app.get("/allproducts", async (request, response) => {
  let products = await Product.find({});
  console.log("All products fetched");
  response.send(products);
});

// schema creating for user model

const User = mongoose("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  data: {
    type: Date,
    default: Date.now(),
  },
});

//creating endpoint for registering the user

app.post("/signup", async (request, response) => {
  let check = await Users.findOne({ email: request.body.email });

  if (check) {
    return response.status(400).json({
      success: false,
      errors: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: request.body.username,
    email: request.body.email,
    password: request.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  response.json({
    success: true,
    token,
  });
});

app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port " + port);
  } else {
    console.log("error " + error);
  }
  // connectDB();
});
