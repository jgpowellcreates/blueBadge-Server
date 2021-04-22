const router = require('express').Router();

router.get('/test', (req,res) => {
    res.send("This is my user test route.")
})

router.post('/register', (req,res) => {
    res.send("Registration successful.");
})

router.post('/login', (req,res) => {
    res.send("You logged in REAL nice");
})



module.exports = router;

//Testing-Denea!