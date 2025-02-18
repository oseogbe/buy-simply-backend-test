const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to my Test API");
});

const routes = require("./routes");
app.use("/api", routes);

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
