const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
  user
    .save()
    .then(() => {
      req.session.message = {
        type: "success",
        message: "User added successfully!",
      };
      res.redirect("/");
    })
    .catch((err) => res.json({ message: err.message, type: "danger" }));
});

router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      res.render("index", {
        title: "Home-Page",
        users: users,
      });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

router.get("/edit/:id",upload, (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("edit_users", {
        title: "Edit User",
        user: user,
      });
    })
    .catch((err) => {
      res.redirect("/");
    });
});
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  })
    .then(() => {
      req.session.message = {
        type: "success",
        message: "User  updated successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.json({ message: err.message, type: "danger" });
    });
});

router.get("/delete/:id",(req,res)=>{
  let id = req.params.id;
  User.findByIdAndDelete(id).then(()=>{
    req.session.message = {
      type: "success",
      message: "User  deleted successfully",
    };
    res.redirect("/");
  }).catch((err)=>{
     res.json({message : err.message , type : "danger"})
  })

  }
)

module.exports = router;
