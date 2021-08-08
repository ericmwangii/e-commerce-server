const express = require("express");
const app = express();
const cors = require("cors");
const api = require("./api");
const upload = require("./multer");
require("dotenv").config();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/products", api.getAllItems);
app.get("/products/:id", api.getItem);
app.post("/products", upload.single("imageUrl"), api.addItem);
app.put("/products/:id", upload.single("imageUrl"), api.updateItem);
app.delete("/products/:id", api.deleteItem);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on Port ${PORT}`);
});
