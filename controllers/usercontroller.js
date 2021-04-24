const router = require('express').Router();
const { UserModel } = require("../models");

router.get('/test', (req,res) => {
    res.send("This is my user test route.")
})

router.post('/register', async (req,res) => {
    const {email, username, password, firstName, lastName} = req.body; //revisit when we have modals
    try{
        //console.log(req.body);
        const newUser = await UserModel.create({
            email,
            username,
            password,
            firstName,
            lastName
        });

        //console.log("new user", newUser, email, username);
        res.status(201).json({
            message: "User Registered!",
            user: newUser
        })
    } catch(err) {
        res.status(500).json({
            message: "Failed to register",
            error: err
        })
    }

})

router.post('/login', (req,res) => {
    res.send("You logged in REAL nice");
})


module.exports = router;