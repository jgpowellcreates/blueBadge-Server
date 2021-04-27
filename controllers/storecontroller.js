const router = require('express').Router();
const validateJWT = require("../middleware/validate-session");
const { UniqueConstraintError } = require("sequelize/lib/errors")
const {StoreModel, ProductModel} = require("../models");
const Store = require('../models/store');


/*
====================================================================
/mystore/ GET (This displays all of a store's info & products)
====================================================================

This looks for a store that belongs to the logged in user
*/

router.get('/mystore', validateJWT, async (req, res) => {
    const userId = req.user.id;

    try {
        const STORE = await StoreModel.findOne({
            where: {
                userId
            }
        })

        let storeId = STORE.id

        const PRODUCT = await ProductModel.findAll({
            where: {
                storeId
            }
        });

        res.status(200).json({
            storeName: STORE.storeName,
            storeLocation: STORE.storeLocation,
            storeDescription: STORE.storeDescription,
            products: PRODUCT
        });
    } catch (err) {
        res.status(500).json({
            messOrigin: "storecontroller",
            error: err });
    }
})

/*
====================================================================
/store/:storeId GET (This displays all of a store's info & products)
====================================================================
*/
//THIS IS A STRETCH GOAL. THIS WOULD ANYONE PULL UP A STORE'S INFO AND PRODUCTS BY STOREID.

router.get('/:storeId', async (req, res) => {
    let { storeId } = req.params;

    try {
        const STORE = await StoreModel.findOne({
            where: {
                id: storeId
            }
        })
        const PRODUCT = await ProductModel.findAll({
            where: {
                storeId
            }
        });

        res.status(200).json({
            storeName: STORE.storeName,
            storeLocation: STORE.storeLocation,
            storeDescription: STORE.storeDescription,
            products: PRODUCT
        });
    } catch (err) {
        res.status(500).json({ error: err });
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


/*
============================================================
/store/:id PUT (This updates a store's information)
============================================================
*/

router.put('/:storeId', validateJWT, async (req, res) => {
    const {storeName, storeLocation, storeDescription} = req.body;
    const userId = req.user.id;
    const {storeId} = req.params;
    console.log("I made it through var declaration")

    const query = {
        where: {
            id: storeId,
            userId
        }
    }

    console.log("Query---> ",query)

    const updatedStore = {
        storeName,
        storeLocation,
        storeDescription
    }
    console.log("I declared my updated store", updatedStore)

    try {
        const updateResponse = await StoreModel.update(updatedStore, query);
        res.status(200).json({
            message: "You've updated your store info successfully!",
            updateResponse,
            updatedStore
        });
    } catch (err) {
        res.status(404).json({ error: err });
    }
})

/*
============================================================
/store/:id DELETE (Delete's a User's Store)
============================================================
*/

router.delete('/:storeId', validateJWT, async (req, res) => {
    const userId = req.user.id;
    const { storeId } = req.params;

    try {
        const query = {
            where: {
                id: storeId,
                userId
            }
        };
        console.log(query)

        await StoreModel.destroy(query);
        res.status(200).json({message: "You store was successfully deleted"});
    } catch (err) {
        res.status(500).json({error: err});
    }
})

module.exports = router;