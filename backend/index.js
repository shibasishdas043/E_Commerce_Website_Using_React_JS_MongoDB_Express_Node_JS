const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// mongodb+srv://shibasishdas043_db_user:<db_password>@cluster0.si9gkky.mongodb.net/

mongoose
  .connect(
    "mongodb+srv://shibasishdas043_db_user:+!Zibg9tQ!a7_6g@cluster0.si9gkky.mongodb.net/?appName=Cluster0",
  )
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error: ", err.message);
  });

//API Creation

app.get("/", (request, response) => {
  response.send("Express App is Running");
});



//Image storage engine

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (request, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
})

const upload = multer({
  storage:storage
})

//creating upload endpoint for images

app.use('./images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (request, response) => {
  response.json({
    success: 1,
    image_url:`http://localhost:${port}/images/${request.file.filename}`,
  })
})

app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port " + port);
  } else {
    console.log("error " + error);
  }
});