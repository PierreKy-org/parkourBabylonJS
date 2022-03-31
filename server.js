const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

var cors = require("cors");
app.use(cors());

app.use("/", express.static("public"));

app.listen(port);
console.log("express running at http://localhost:%d", port);
