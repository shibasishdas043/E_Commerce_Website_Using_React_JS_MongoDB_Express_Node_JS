require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const port = process.env.PORT || 4000;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://e-commerce-website-using-react-js-m.vercel.app",
      "https://e-commerce-website-using-react-js-m-taupe.vercel.app",
    ],
    credentials: true,
  }),
);

// MongoDB connect
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// Root route
app.get("/", (request, response) => {
  response.send("Express App is Running");
});

// Upload image to Cloudinary
app.post("/upload", upload.single("product"), (request, response) => {
  response.json({
    success: 1,
    image_url: request.file.path, // Cloudinary URL returned directly
  });
});

// Product schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Add product
app.post("/addproduct", async (request, response) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product = products.slice(-1)[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: request.body.name,
    image: request.body.image,
    category: request.body.category,
    new_price: request.body.new_price,
    old_price: request.body.old_price,
  });

  await product.save();
  console.log("✅ Product saved");
  response.json({ success: true, name: request.body.name });
});

// Remove product
app.post("/removeproduct", async (request, response) => {
  await Product.findOneAndDelete({ id: request.body.id });
  console.log("✅ Product removed");
  response.json({ success: true, name: request.body.name });
});

// Get all products
app.get("/allproducts", async (request, response) => {
  let products = await Product.find({});
  console.log("✅ All products fetched");
  response.send(products);
});

// User schema
const User = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Signup
app.post("/signup", async (request, response) => {
  try {
    let check = await User.findOne({ email: request.body.email });
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

    const user = new User({
      name: request.body.username,
      email: request.body.email,
      password: request.body.password,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
    response.json({ success: true, token });
  } catch (error) {
    console.log("Signup Error", error);
    response
      .status(500)
      .json({ success: false, errors: "Internal Server Error" });
  }
});

// Login
app.post("/login", async (request, response) => {
  let user = await User.findOne({ email: request.body.email });
  if (user) {
    const passCompare = request.body.password === user.password;
    if (passCompare) {
      const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
      response.json({ success: true, token });
    } else {
      response.json({ success: false, errors: "Wrong password" });
    }
  } else {
    response.json({ success: false, errors: "Wrong email" });
  }
});

// New collections
app.get("/newcollections", async (request, response) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("✅ NewCollection Fetched");
  response.send(newcollection);
});

// Popular in women
app.get("/popularinwoman", async (request, response) => {
  let products = await Product.find({ category: "women" });
  let popular_in_woman = products.slice(0, 4);
  console.log("✅ Popular in Woman Fetched");
  response.send(popular_in_woman);
});

// Fetch user middleware
const fetchUser = async (request, response, next) => {
  const token = request.header("auth-token");
  if (!token) {
    response
      .status(401)
      .send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      request.user = data.user;
      next();
    } catch (error) {
      response
        .status(401)
        .send({ errors: "Please authenticate using valid token" });
    }
  }
};

// Add to cart
app.post("/addtocart", fetchUser, async (request, response) => {
  let userData = await User.findOne({ _id: request.user.id });
  userData.cartData[request.body.itemId] += 1;
  await User.findOneAndUpdate(
    { _id: request.user.id },
    { cartData: userData.cartData },
  );
  response.send("Added");
});

// Remove from cart
app.post("/removefromcart", fetchUser, async (request, response) => {
  let userData = await User.findOne({ _id: request.user.id });
  if (userData.cartData[request.body.itemId] > 0) {
    userData.cartData[request.body.itemId] -= 1;
  }
  await User.findOneAndUpdate(
    { _id: request.user.id },
    { cartData: userData.cartData },
  );
  response.send("Removed");
});

// Get cart
app.post("/getcart", fetchUser, async (request, response) => {
  let userData = await User.findOne({ _id: request.user.id });
  response.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("✅ Server running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});
