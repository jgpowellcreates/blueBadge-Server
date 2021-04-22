const router = require('express').Router();
const { UserModel } = require("../models");

router.get('/test', (req,res) => {
    res.send("This is my user test route.")
})

module.exports = router;
