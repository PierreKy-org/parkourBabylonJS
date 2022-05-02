const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8000;

var cors = require("cors");
app.use(cors());

app.use("/", express.static("public"));

//receive a request from client
app.get("/levels", (req, res) => {
  //send a response to client
  res.send(fs.readdirSync(path.join(__dirname, "public/assets/levels")));
});

app.listen(port);
console.log("express running at http://localhost:%d", port);
