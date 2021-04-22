const router = require('express').Router();

router.get('/test', (req,res) => {
    res.send("This is my user test route.")
})

module.exports = router;