const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Cart = require("../models/cart");
const router = express.Router();

router.post(
    "/addToCart",
    checkAuth,
    (req, res, next) => {
      const post = new Cart({
        type:req.body.type,
        imagePath: req.body.imagePath,
        price: req.body.price,
        creator:req.userData.userId
      });
      post.save().then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      });
    }
  );
  
  router.get("/getCartItems", (req, res, next) => {
    Cart.find().then(post => {
      if (post) {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: post
        });
      } else {
        res.status(404).json({ message: "Cart Items not found!" });
      }
    });
  });

  router.delete("/:id", checkAuth, (req, res, next) => {
    Cart.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
      result => {
        console.log(result);
        if (result.n > 0) {
          res.status(200).json({ message: "Deletion successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      }
    );
  });

module.exports = router;
