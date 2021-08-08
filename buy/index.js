const express = require("express");
const app = express();
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

app.use(cors());

sgMail.setApiKey(
  "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"
);

const PORT = process.env.PORT || 5003;

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/buy", (request, response) => {
  const email = request.body.email;
  const moviename = request.body.moviename;
  const price = request.body.price;

  const msg = {
    to: email,
    from: "hitwizard99@gmail.com",
    subject: `Order for ${moviename}`,
    text: "Order from Burudani",
    html: `<p>Your order for <b>${moviename}</b> is being processed and will arrive at your address in three to five business days. It costs Ksh ${price}. Pay on Delivery.</p>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log(msg);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT ${PORT}`);
});
