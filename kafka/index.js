const express = require("express");
const { Pool } = require("pg");
const format = require("pg-format");
const Kafka = require("node-rdkafka");

const PORT = process.env.PORT || 5001;
const sslFlag = true;

const CLICK_KAFKA_TOPIC = "purchases";

// Connect to postgres
const pool = new Pool({
  user: "eric",
  host: "db",
  database: "advprog",
  password: "sf90hv6",
  port: 5432,
});

// Kafka
let kafkaTopics = "purchases";

var consumer = new Kafka.KafkaConsumer(
  {
    "client.id": "lkc-vo6pj",
    "group.id": "purchases",
    "metadata.broker.list": "pkc-lzvrd.us-west4.gcp.confluent.cloud:9092",
    "security.protocol": "SSL",
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "PLAIN",
    "sasl.username": "2KRXRXOBEROGKM57",
    "sasl.password":
      "m0EVl0obXqHumBEHzxOG4DHrT9CSy8A94o0M9qVjvrO9bGH30dV2DGw25lJRGoqk",
    "enable.auto.commit": false,
    offset_commit_cb: function (err, topicPartitions) {
      if (err) {
        console.error("There was an error committing");
        console.error(err);
      } else {
        console.log("New offset successfully committed.");
      }
    },
  },
  {}
);

consumer.connect({}, (err, data) => {
  if (err) {
    console.error(`Consumer connection failed: ${err}`);
  } else {
    console.log(
      `Connection to kafka broker successful: ${JSON.stringify(data)}`
    );
  }
});

let productClicks = {};

//save clicks every 60 seconds
setInterval(saveStatsToPostgres, sslFlag ? 60000 : 5000);

function saveStatsToPostgres() {
  let newClicks = false;

  let clickValues = Object.keys(productClicks).map((key) => {
    return [key, productClicks[key]];
  });

  let clickEventQuery = format(
    "INSERT INTO button_click(button_id,clicks) VALUES %L",
    clickValues
  );
  console.log(clickEventQuery);

  if (clickValues.length > 0) newClicks = true;

  if (!newClicks) {
    console.log("no new events to record!");
  } else {
    (async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        let rows;
        if (newClicks) {
          rows = await client.query(clickEventQuery);
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
        console.log(
          "successfully saved data to postgres. committing new offset."
        );
        consumer.commit();
        productClicks = {};
      }
    })().catch((e) => console.error(e.stack));
  }
}

consumer
  .on("ready", (id, metadata) => {
    console.log(kafkaTopics);
    consumer.subscribe([kafkaTopics]);
    consumer.consume();
    consumer.on("error", (err) => {
      console.log(`!Error in Kafka consumer: ${err.stack}`);
    });
    console.log("Kafka consumer ready." + JSON.stringify(metadata));
  })
  .on("data", function (data) {
    const message = data.value.toString();
    const { button_id, topic } = JSON.parse(message);
    console.log(data);
    switch (topic) {
      case CLICK_KAFKA_TOPIC:
        if (button_id in productClicks) productClicks[button_id]++;
        else productClicks[button_id] = 1;
        break;
    }
  })
  .on("event.log", function (log) {
    console.log(log);
  })
  .on("event.error", function (err) {
    console.error("Error from consumer");
    console.error(err);
  });

//
// Server
//
const app = express();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

// returns the number of clicks per button in the db
app.get("/api/clickCount", (req, res, next) => {
  const clickEventSql =
    "SELECT button_id, SUM(clicks) FROM button_click GROUP BY button_id";
  pool
    .query(clickEventSql)
    .then((pgResponse) => {
      // console.log(pgResponse);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(pgResponse.rows));
      next();
    })
    .catch((error) => {
      next(error);
    });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Error calling ");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on Port ${PORT}`);
});
