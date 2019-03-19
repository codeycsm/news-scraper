let express = require("express"),
  db = require("../connection/schema"),
  axios = require("axios"),
  cheerio = require("cheerio"),
  router = express.Router();

router.get("/scrape", function(req, res) {
  axios
    .get("https://www.ksl.com/")
    .then(function(response) {
      let $ = cheerio.load(response.data);
      let news = [];
      $(".queue_story").each(function(i, data) {
        article = {
          title: $(data)
            .children(".headline")
            .children("h2")
            .children("a")
            .text(),
          link: $(data)
            .children(".headline")
            .children("h2")
            .children("a")
            .attr("href"),
          date: $(data)
            .children(".headline")
            .children("h4")
            .children(".short")
            .text()
        };
        news.push(article);
      });
      res.send(news);
    })
    .catch(function(err) {
      console.log(err);
    });
});

router.post("/save", function(req, res) {
  db.create({
    title: req.body.title,
    date: req.body.date,
    link: req.body.link
  })
    .then(function(response) {})
    .catch(function(err) {
      console.log(err);
    });
});

router.get("/saved", function(req, res) {
  console.log("Saved Route");
  db.find({}).then(function(response) {
    res.send(response);
  });
});
// Delete Article route
router.delete("/delete", function(req, res) {
  let id = req.body.id;
  console.log("Delete Route");
  console.log(id);
  db.findOneAndDelete({ _id: id }).then(function() {
    db.find({}).then(function(response) {
      res.send(response);
    });
  });
});

router.post("/comments", function(req, res) {
  let id = req.body.id;
  db.findById(id).then(function(response) {
    res.send(response);
  });
});

router.post("/new-comment", function(req, res) {
  console.log(req.body);
  db.findOneAndUpdate(
    { _id: req.body.id },
    { $push: { comment: req.body.comment } }
  )
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      console.log(err);
    });
});
module.exports = router;
