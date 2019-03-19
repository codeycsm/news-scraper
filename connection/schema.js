const mongoose = require("mongoose");
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function() {
  console.log("connected to db");
});

let Model = mongoose.Schema({
  title: String,
  date: String,
  link: String,
  comment: Array
});

module.exports = mongoose.model("Article", Model);
