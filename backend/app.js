const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const Post = require("./models/posts");

const app = express();

mongoose.connect("mongodb+srv://max:PI1ZdaB2EEsPkV8t@cluster0-yzem9.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.warn("Connection failed");
  })

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then(result => {
    res.status(201).json({
      message: "Success",
      postId: result._id
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then(docs => {
    res.status(200).json({
      message: "Success",
      posts: docs
    });
  })
  .catch(() =>{});
});

app.delete("/api/posts/:id", (req, res) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message:"Deleted"});
  });
});

module.exports = app;
