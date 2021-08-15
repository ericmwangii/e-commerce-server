const express = require("express");
const app = express();
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const Kafka = require("node-rdkafka");

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

//kafka
const producer = new Kafka.Producer({
  "client.id": "lkc-vo6pj",
  "metadata.broker.list": "pkc-lzvrd.us-west4.gcp.confluent.cloud:9092",
  "security.protocol": "SSL",
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "PLAIN",
  "sasl.username": "2KRXRXOBEROGKM57",
  "sasl.password":
    "m0EVl0obXqHumBEHzxOG4DHrT9CSy8A94o0M9qVjvrO9bGH30dV2DGw25lJRGoqk",
});

// connnect to broker manually
producer.connect({}, (err, data) => {
  if (err) {
    console.error(`producer connection callback err: ${err}`);
  }
});

producer.connect();

// Wait for the ready event before proceeding
producer.on("ready", function () {
  console.log(`Kafka producer ready`);
});

// Any errors we encounter, including connection errors
producer.on("event.error", function (err) {
  console.error("Kafka Producer event error:");
  console.error(err);
});

app.post("/buy", (request, response) => {
  const { email, moviename, total, address, topic, button_id } = request.body;

  const msg = {
    to: email,
    from: "hitwizard99@gmail.com",
    subject: `Order for ${moviename}`,
    text: "Order from Burudani",
    html: `<p>Your order for <b>${moviename}</b> is being processed and will arrive at your ${address} in three to five business days. It costs Ksh ${total}. Pay on Delivery.</p>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      // console.log(msg);
    })
    .catch((error) => {
      console.log(error);
    });

  try {
    const topic = "purchases";
    // console.log(topic);

    producer.produce(
      topic,
      null,
      Buffer.from(
        JSON.stringify({ moviename, email, total, topic, button_id })
      ),
      null,
      Date.now()
    );
  } catch (err) {
    console.log("Problem Occurred when sending message");
    throw err;
  }
  response.status(200).send("Success");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT ${PORT}`);
});
