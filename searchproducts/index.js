const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./api");
require("dotenv").config();

const PORT = process.env.PORT || 5001;

app.use(cors());

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

app.get("/", (request, response) => {
  response.send("Hello world!");
});

app.get("/movies", api.getProduct);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT ${PORT}`);
});
