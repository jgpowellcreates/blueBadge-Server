const router = require('express').Router();
const validateJWT = require("../middleware/validate-session");
const { UniqueConstraintError } = require("sequelize/lib/errors")
const {StoreModel} = require("../models");

/*
============================================================
/store/:id GET (Finds A Store's Info)
============================================================
*/

router.get("/:id", async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
        const USER = await StoreModel.findOne({
            where: {
                userId: id
            }
        });
        res.status(200).json({
            storeName: USER.storeName,
            storeLocation: USER.storeLocation,
            storeDescription: USER.storeDescription,
            productsArray: USER.productsArray
        })
    } catch (err) {
        res.status(500).json({
            error: err,
            messageOrigin: "storeController",
            returnedId: id
        })
    }
})


/*
============================================================
/store/create POST (Creates A Store)
============================================================
*/

router.post("/create", validateJWT, async (req, res) => {
    console.log(req)
    const {storeName, storeLocation, storeDescription} = req.body;
    const userId = req.user.id;
    const storeEntry = {
        storeName,
        storeLocation,
        storeDescription,
        userId
    }
    try {
        const newStore = await StoreModel.create(storeEntry);
        res.status(200).json(newStore);
    } catch (err) {
        if(err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "This store name is already in use."
            })
        } else {
            res.status(500).json({error: err})
        }
    }
});

module.exports = router;