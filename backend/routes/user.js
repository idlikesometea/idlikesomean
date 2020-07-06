const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'Success',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post("/login", (req, res, next) => {
  let userData;
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    userData = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status.json(401)({
        message: 'Auth failed'
      });
    }
    const token = jwt.sign(
      { email: userData.email, userId:userData._id },
      'secret_tmp',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token: token,
      message: 'success'
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Auth failed'
    });
  });
});

module.exports = router;
