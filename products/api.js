const Pool = require("pg").Pool;
require("dotenv").config();
const cloudinary = require("./cloudinary");

const pool = new Pool({
  user: "eric",
  host: "db",
  database: "advprog",
  password: "sf90hv6",
  port: 5432,
});

//add item
const addItem = async (request, response) => {
  const result = await cloudinary.uploader.upload(request.file.path);

  const data = {
    name: request.body.name,
    imageUrl: result.secure_url,
    price: request.body.price,
  };

  pool.query(
    "INSERT INTO items ( name, imageUrl, price) VALUES ($1, $2, $3)",
    [data.name, data.imageUrl, data.price],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("Item Added");
    }
  );
};

//get Items
const getAllItems = (request, response) => {
  pool.query(
    "SELECT * FROM items",

    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

//get by id
const getItem = (request, response) => {
  const id = request.params.id;

  pool.query("SELECT * FROM items WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//update item
const updateItem = async (request, response) => {
  const result = await cloudinary.uploader.upload(request.file.path);

  const id = request.params.id;

  const updateItem = {
    name: request.body.name,
    imageUrl: result.secure_url,
    price: request.body.price,
  };

  pool.query(
    "UPDATE items SET name = $1, imageUrl = $2, price = $3 WHERE id = $4",
    [updateItem.name, updateItem.imageUrl, updateItem.price, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(`Item with id ${id} has been modified`);
    }
  );
};

//Delete item
const deleteItem = (request, response) => {
  const id = request.params.id;

  pool.query("DELETE FROM items WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(`Item with id ${id} has been deleted`);
  });
};

module.exports = { addItem, getAllItems, getItem, updateItem, deleteItem };
