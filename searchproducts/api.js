const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

const getProduct = (request, response) => {
  let name = request.query.name;

  pool.query(
    "SELECT * FROM items WHERE name = $1",
    [name],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

module.exports = { getProduct };
