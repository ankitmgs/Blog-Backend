const express = require("express");
const router = express.Router();
const Users = require("../models/postModel");
const Comment = require("../models/commentModel");

// POST method

router.post("/posts", async (req, res) => {
  try {
    const post = new Users(req.body);
    console.log(post);
    await post.save();
    return res.status(201).send(post);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal server error");
  }
});

///GET method
router.get("/getall", async (req, res) => {
  try {
    const allPosts = await Users.find()
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    return res.status(201).send(allPosts);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});
// Get by id method
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Users.findById(req.params.id)
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    if (!post) {
      return res.status(404).send({ message: "Post is not found!" });
    } else {
      return res.status(200).send({ message: "This is user post", post });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

//PUT method

router.patch("/update/:id", async (req, res) => {
  try {
    const post = await Users.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: "post not found" });
    }

    post.set(req.body);
    await post.save();
    res.send({ message: "User updated successfully", post });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});
//delete method
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);

  await Users.findByIdAndDelete(id)
    .then((data) => {
      console.log(data);
      return res.status(200).send({ message: "user deleted!" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal server error" });
    });
});
// get by category

router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const posts = await Users.find({ tags: category })
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });
    if (posts.length === 0) {
      return res
        .status(404)
        .send({ message: "No posts found in this category!" });
    } else {
      return res.status(200).send({ message: "Posts in the category", posts });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// POST comment
router.post("/comment/:blogId", async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { text, author } = req.body;

    const comment = new Comment({ blog: blogId, text, author });
    const savedComment = await comment.save();

    const blog = await Users.findByIdAndUpdate(
      blogId,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    res.json(savedComment);
  } catch (error) {
    console.error("Error adding the comment:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
