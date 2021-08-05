const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "ddc3pxrf5", //process.env.CLOUD_NAME,
  api_key: "715168874311949", //process.env.API_KEY,
  api_secret: "nWyxudlEcjwVyrmgpngjDVM4T7Y", //process.env.API_SECRET,
});
module.exports = cloudinary;
