const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

//post review
const addReview = (request, response) => {
  const { userId, username, moviename, image, review, reviewId } = request.body;

  pool.query(
    "INSERT INTO reviews ( userId, username,moviename,image,review, reviewId) VALUES ($1, $2, $3, $4, $5, $6)",
    [userId, username, moviename, image, review, reviewId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("Review Added");
    }
  );
};

//get Reviews
const getReviews = (request, response) => {
  pool.query(
    "SELECT * FROM reviews",

    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

//get by id
const getReviewById = (request, response) => {
  const reviewId = request.params.reviewId;

  pool.query(
    "SELECT * FROM reviews WHERE reviewId = $1",
    [reviewId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

//updateReview
const updateReview = (request, response) => {
  const reviewId = request.params.reviewId;

  const { review } = request.body;

  pool.query(
    "UPDATE reviews SET review = $1 WHERE reviewId =$2",
    [review, reviewId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(`Review with id ${reviewId} has been modified`);
    }
  );
};

//Delete review
const deleteReview = (request, response) => {
  const reviewId = request.params.reviewId;

  pool.query(
    "DELETE FROM reviews WHERE reviewId = $1",
    [reviewId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(`Review id ${reviewId} has been deleted`);
    }
  );
};

module.exports = {
  addReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
