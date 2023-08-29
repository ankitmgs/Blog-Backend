const express = require("express");
const router = express.Router();
const Users = require("../models/userModel");

//for register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  //sabse pehle check krege mail database me hai ki nhi
  try {
    const existEmail = await Users.findOne({ email: email });
    if (existEmail === null) {
      const newUser = new Users({ name, email, password });
      await newUser.save();
      return res.status(200).send(newUser);
    } else {
      return res.status(409).send({ message: "Email Already Exist!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Serve Error" });
  }
});

//rehnuma login api

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ message: "Email is not exits!" });
    } else if (user.password === password) {
      return res.status(200).send({ message: "Login Successfully", user });
    } else {
      return res.status(401).send({ message: "password not match " });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error ");
  }
});
//get all

router.get("/getall", async (req, res) => {
  Users.find({})
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send("Internal server error");
    });
});

// delete
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

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

//update
router.patch("/update/:userid", async (req, res) => {
  const id = req.params.userid;
  console.log(id);
  const updatedData = req.body;
  await Users.findByIdAndUpdate(id, updatedData)
    .then((data) => {
      console.log(data);
      return res.status(200).send({ message: "user update !" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal server error" });
    });
});

module.exports = router;
