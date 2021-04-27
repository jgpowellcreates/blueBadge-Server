const router = require('express').Router();
const { validateSession } = require('../middleware');
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { UniqueConstraintError } = require("sequelize/lib/errors")

router.get('/test', (req, res) => {
    res.send("This is my user test route.")
})

/*
============================================================
/user/regiser POST (Create a New User)
============================================================
*/

router.post('/register', async (req, res) => {
    const { email, username, password, firstName, lastName } = req.body; //revisit when we have modals
    try {
        const newUser = await UserModel.create({
            email,
            username,
            firstName,
            lastName,
            password: bcrypt.hashSync(password, 13),
            shoppingCartContents: []
        });

        const token = jwt.sign(
            { id: newUser.id },
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

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
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
                    { id: loginUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 60 * 60 * 24 }
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
============================================================
/user/update PUT (Update an existing user)
============================================================
*/

router.put("/update/:userId", async (req, res) => {

    const { username, email, firstName, lastName } = req.body;
    const { userId } = req.params;

    const query = {
        where: {
            id: userId
        }
    };

    const updatedUser = {
        username,
        email,
        firstName,
        lastName
    };
  
    try {
        const update = await UserModel.update(updatedUser, query);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

/*
============================================================
/user/delete/:ownerId DELETE (Delete an Existing User)
============================================================
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
        res.status(200).json({ message: "User Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

/*
============================================================
/user/addtocart/:userID POST (Adds a productID to the shoppingcartArray of a User)
============================================================
*/

router.put("/addtocart/:userID", async (req, res) => {
    const { userID } = req.params;
    const { productID } = req.body;
    
    let currentUser = await UserModel.findOne({
        where: {
            id: userID
        }
    })

    const currentArray = currentUser.shoppingCartContents;

    currentArray.push(productID);

    console.log(currentArray)

    const query = {
        where: {
            id: userID
        }
    };

    const updatedUser = {
        shoppingCartContents: currentArray
    };

    try {
        const update = await UserModel.update(updatedUser, query);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

/*
============================================================
/user/checkout/:userID POST (Adds a productID to the shoppingcartArray of a User)
============================================================
*/

router.put("/checkout/:userID", async (req, res) => {
    const { userID } = req.params;

    const query = {
        where: {
            id: userID
        }
    };

    const updatedUser = {
        shoppingCartContents: []
    };

    try {
        const update = await UserModel.update(updatedUser, query);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

/*
============================================================
/user/returnshoppingcart/:userID GET (Returns the shopping cart of the user)
============================================================
*/

router.get("/returnshoppingcart/:userID", async (req, res) => {
    const { userID } = req.params;

    try {
        let currentUser = await UserModel.findOne({
            where: {
                id: userID
            }
        })
    
        const shoppingCartArray = currentUser.shoppingCartContents;
        res.status(200).json({ shoppingCartArray: shoppingCartArray })
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

module.exports = router;
