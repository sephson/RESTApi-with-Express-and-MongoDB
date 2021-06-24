const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// article.save();

//all articles
app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) res.send(foundArticles);
      else res.send(err);
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) res.send("Successfully Added article");
      else res.send(err);
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) res.send("All articles deleted");
      else res.send(err);
    });
  });
//specific aticles
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) res.send(foundArticle);
      else res.send("No article matching that id was found");
    });
    console.log(req.params);
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) res.send("Article updated successfully");
        else res.send("Article couldnt Update");
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) res.send("Successful");
        else res.send(err);
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) res.send("Deleted");
      else res.send(err);
    });
  });
app.listen(3000, () => {
  console.log("server running on port 3000");
});
