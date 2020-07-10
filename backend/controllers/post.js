const Post = require("../models/posts");


exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(result => {
    res.status(201).json({
      message: "Success",
      post: {
        ...result,
        id: result._id
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Creating a post failed'
    })
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    if (result.n) {
      res.status(200).json({
        message: 'Update successful'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized'
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Could not update post'
    })
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then(docs => {
    fetchedPosts = docs;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Success",
      posts: fetchedPosts,
      total: count
    });
  })
  .catch(err => {
    res.status(501).json({
      message: "Fetching posts failed"
    });
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found'
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      message: "Fetching post failed"
    });
  });
};

exports.deletePost = (req, res) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n) {
      res.status(200).json({message:"Deleted"});
    } else {
      res.status(401).json({message:"Not authorized"});
    }
  })
  .catch(err => {
    res.status(501).json({
      message: "Deleting post failed"
    });
  });;
};
