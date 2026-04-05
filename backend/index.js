require("dotenv").config();
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());
// app.use(cors());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-commerce-website-using-react-js-m.vercel.app",
      "https://e-commerce-website-using-react-js-m-taupe.vercel.app",
    ],
    credentials: true,
  }),
);

// mongoose.connect(process.env.MONGO_URL);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit if DB can't connect
  }
};
connectDB();

//API Creation

app.get("/", (request, response) => {
  response.send("Express App is Running");
});

//Image storage engine

// const storage = multer.diskStorage({
//   destination: "./upload/images",
//   filename: (request, file, cb) => {
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
// });
// app.use("/images", express.static("upload/images"));

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: storage });

//creating upload endpoint for images


// app.post("/upload", upload.single("product"), (request, response) => {
//   response.json({
//     success: 1,
//     image_url: `${process.env.BACKEND_URL}/images/${request.file.filename}`,
//   });
// });

app.post("/upload", upload.single("product"), (request, response) => {
  response.json({
    success: 1,
    image_url: request.file.path, // Cloudinary gives the URL directly
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
    default: Date.now,
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

const User = mongoose.model("Users", {
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
  date: {
    type: Date,
    default: Date.now,
  },
});

//creating endpoint for registering the user

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
  } catch (error) {
    console.log("Signup Error", error);
    response.status(500).json({
      success: false,
      errors: "Internal Server Error",
    });
  }
});

//creating endpoint for user login

app.post("/login", async (request, response) => {
  let user = await User.findOne({
    email: request.body.email,
  });
  if (user) {
    const passCompare = request.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      response.json({ success: true, token });
    } else {
      response.json({ success: false, errors: "Wrong" });
    }
  } else {
    response.json({
      success: false,
      errors: "Wrong Email Id",
    });
  }
});

//creating endpoint for new collection data

app.get("/newcollections", async (request, response) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  response.send(newcollection);
});

//creating endpoint for popular in woman setion

app.get("/popularinwoman", async (request, response) => {
  let products = await Product.find({ category: "women" });
  let popular_in_woman = products.slice(0, 4);
  console.log("Popular in Woman Fetched");
  response.send(popular_in_woman);
});

//creating middleware to fetch user

const fetchUser = async (request, response, next) => {
  const token = request.header("auth-token");
  if (!token) {
    response.status(401).send({ errors: "Please authcate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      request.user = data.user;
      next();
    } catch (error) {
      response
        .status(401)
        .send({ errors: "please authcate using valid token" });
    }
  }
};

//creating endpoint for adding products in cartdata

app.post("/addtocart", fetchUser, async (request, response) => {
  // console.log(request.body, request.user);
  console.log("added", request.body.itemId);
  let userData = await User.findOne({ _id: request.user.id });
  userData.cartData[request.body.itemId] += 1;

  await User.findOneAndUpdate(
    {
      _id: request.user.id,
    },
    {
      cartData: userData.cartData,
    },
  );

  response.send("Added");
});

//creating endpoint to remove product from cart data

app.post("/removefromcart", fetchUser, async (request, response) => {
  console.log("removed", request.body.itemId);
  let userData = await User.findOne({ _id: request.user.id });
  if (userData.cartData[request.body.itemId] > 0) {
    userData.cartData[request.body.itemId] -= 1;
  }

  await User.findOneAndUpdate(
    {
      _id: request.user.id,
    },
    {
      cartData: userData.cartData,
    },
  );

  response.send("Removed");
});

//creating endpoint to get cart data

app.post("/getcart", fetchUser, async (request, response) => {
  console.log("GetCart");
  let userData = await User.findOne({
    _id: request.user.id,
  });

  response.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port " + port);
  } else {
    console.log("error " + error);
  }
});
