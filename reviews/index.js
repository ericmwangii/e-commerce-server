const express = require("express");
const app = express();
const cors = require("cors");
const api = require("./api");
require("dotenv").config();

app.use(cors());

const PORT = process.env.PORT || 5002;

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

app.get("/reviews", api.getReviews);
app.get("/review/:reviewId", api.getReviewById);
app.post("/reviews", api.addReview);
app.put("/review/:reviewId", api.updateReview);
app.delete("/review/:reviewId", api.deleteReview);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on Port ${PORT}`);
});
