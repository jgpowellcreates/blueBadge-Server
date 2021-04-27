const router = require('express').Router();
const { validateSession } = require('../middleware');
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { UniqueConstraintError } = require("sequelize/lib/errors")

router.get('/test', (req,res) => {
    res.send("This is my user test route.")
})

/*
============================================================
/user/regiser POST (Create a New User)
============================================================
*/

router.post('/register', async (req,res) => {
    const {email, username, password, firstName, lastName} = req.body; //revisit when we have modals
    try{
        const newUser = await UserModel.create({
            email,
            username,
            firstName,
            lastName,
            password: bcrypt.hashSync(password, 13)
        });

        const token = jwt.sign(
            {id: newUser.id},
            process.env.JWT_SECRET,
            {
                expiresIn: 60 * 60 * 24
            }
        )

        //console.log("new user", newUser, email, username);
        res.status(201).json({
            message: "User Registered!",
            user: newUser,
            token
        }); 
    } catch(err) {
      if(err instanceof UniqueConstraintError) {
          res.status(409).json({
              message: "Email/Username already in use." //Username already in use
          })
      } else {
        res.status(500).json({
            message: "Failed to register",
            error: err,
            messageOrigin: "userController.js"
        })
    
    } 
    }
})

/*
============================================================
/user/login POST (Find an Existing User)
============================================================
*/

router.post('/login', async (req,res) => {
    let {username, password} = req.body;
    try {
        let loginUser = await UserModel.findOne({
            where: {
                username
            }
        })
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password); //need to add bcrypt
            
             if (passwordComparison) {
                 const token = jwt.sign(
                     {id: loginUser.id}, 
                     process.env.JWT_SECRET, 
                     {expiresIn: 60 * 60 * 24}
                     )
                 
                 res.status(200).json({
                     message: "User successfully logged in!",
                     user: loginUser,
                     token
                 })
             } else {
                 res.status(401).json({
                     message: "Error: password."
                 })
             }
        } else {
            res.status(401).json({
                message: "Error: username."
            })
        }
    } catch (err) {
        res.status(500).json({
            error: `Failed to login user. ${err}`
        })
    }
})

/*
=======================
*** UPDATE USER ***
=======================
*/

router.put("/update/:userId", async (req,res) =>{
    
    const {username, email, password, firstName, lastName} = req.body;
    const { userId } = req.params;

    const query = {
        where: {
            id: userId
        }
    };

    const updatedUser = {
        username,
        email, 
        password: bcrypt.hashSync(password, 13),
        firstName,
        lastName
    };

    try{
        const update = await UserModel.update(updatedUser, query);
        res.status(200).json({message: "User Updated!"});
    } catch (err) {
        res.status(500).json({error:err})
    }
});

/*
=======================
*** DELETE USER ***
=======================
*/


router.delete("/delete/:ownerId", async (req,res) => {

    const { ownerId } = req.params;
    
    try {
        const query = {
            where: {
                id: ownerId
            }
        };

        await UserModel.destroy(query);
        res.status(200).json({message: "User Removed"});
    }catch (err){
        res.status(500).json({error:err});
    }
})



module.exports = router;
