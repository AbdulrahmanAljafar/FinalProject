const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      res.json({ users: users });
    })
    .catch((err) => res.json({ msg: err }));
});




router.post("/register", (req, res) => {
    console.log("aaaaaaa  d ",req.body);
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      image: req.body.image,
      bio:req.body.bio,
      password:req.body.password,
    };
    
    newUser.email = newUser.email.toLowerCase();
    User.findOne({ email: newUser.email })
      .then((user) => {
        // if the email in the database !
        if (user) {
          res.json({
            msg: "the email was used change it plz ! ",
          });
        }
        // if the email is not insaid the database
        else {
          var salt = bcrypt.genSaltSync(10);
          newUser.password = bcrypt.hashSync(req.body.password, salt);
          newUser.email = newUser.email.toLowerCase();
          User.create(newUser).then((user) => {
            res.json({ msg: "user hasbeen register", user: user });
          });
        }
      })
      .catch((err) => res.json({ msg: err }));
  });


  router.post("/login", async (req, res) => {
      console.log("test")
    let { email, password } = req.body;
    //  let email = req.body.email ; let password = req.body.password
    email = email.toLowerCase();
    const user = await User.findOne({ email: email }); // its same to =>  User.findOne({email:email}).then(user => { })
    // if email is  not exist
    if (!user) {
      res.json({ msg: "email is not exist" });
    }
    // if email is  exist
    else {
      // if password is currect
      if (bcrypt.compareSync(password, user.password)) {
        user.password = undefined;
        let payload = { user };
        let token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 1000 * 60 * 60,
        }); // to the user info
        res.json({ msg: "user login ", token });
      }
      // / if password is not currect
      else {
        res.json({ msg: "password is not currect" });
      }
    }
   
  });


  router.get("/:token", (req, res) => {
    let token = req.params.token;
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) return res.json({ msg: err });
  
      let user = decode;
  
      res.json({ msg: "user decoded", user });
    });
  });

 

  router.get("/profile/:id", async(req,res)=>{
    const userId = req.params.id
    try{
      const user = await User.findById(userId)
      res.json({msg: "user found", user})
    }catch{
      res.json({msg: "error finding user"})
    }
})




  module.exports = router;
  