const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "eric",
  host: "db",
  database: "advprog",
  password: "sf90hv6",
  port: 5432,
});

//post review
const addReview = (request, response) => {
  const { userId, username, moviename, review, reviewid } = request.body;

  pool.query(
    "INSERT INTO reviews ( userId, username, moviename, review, reviewid) VALUES ($1, $2, $3, $4, $5)",
    [userId, username, moviename, review, reviewid],
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
  const reviewid = request.params.reviewid;

  pool.query(
    "SELECT * FROM reviews WHERE reviewid = $1",
    [reviewid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

//Delete review
const deleteReview = (request, response) => {
  const reviewid = request.params.reviewid;

  pool.query(
    "DELETE FROM reviews WHERE reviewid = $1",
    [reviewid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(`Review id ${reviewid} has been deleted`);
    }
  );
};

module.exports = {
  addReview,
  getReviews,
  getReviewById,
  deleteReview,
};
