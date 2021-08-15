const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "eric",
  host: "db",
  database: "advprog",
  password: "sf90hv6",
  port: 5432,
});

const getProduct = (request, response) => {
  let name = request.query.name;

  pool.query(
    "SELECT * FROM items WHERE name = $1 IS NULL OR name =$1",
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
