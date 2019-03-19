let express = require("express"),
  exphbs = require("express-handlebars"),
  htmlRoutes = require("./routes/htmlRoutes"),
  apiRoutes = require("./routes/apiRoutes"),
  app = express(),
  port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.use(htmlRoutes);
app.use(apiRoutes);
app.use(express.static(__dirname + "/public"));

app.listen(port, function() {
  console.log("http://localhost:" + port);
});
