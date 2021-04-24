const router = require('express').Router();
const { ProductModel } = require('../models');

router.get("/test", (req,res) => {
    res.send("This is my product test route");
});

/*
============================================================
/product/create POST (This creates a new product)
============================================================
*/

router.post('/create', async (req,res) => {
    const {productName, price, description, stock} = req.body;
    // const { id } = req.user;
    try{
        const newProduct = await ProductModel.create({
            productName,
            price,
            description,
            stock,
            storeOwner: "128", //eventually will contain destructured id
            imageURL: "https://static01.nyt.com/images/2018/05/03/us/03spongebob_xp/03spongebob_xp-videoSixteenByNineJumbo1600.jpg"
        });

        res.status(201).json({
            message: "Product Created!",
            user: newProduct
        })
    } catch(err) {
        res.status(500).json({
            message: "Failed to create product",
            error: err
        })
    }
})

/*
============================================================
/product/ GET (This returns all the products)
============================================================
*/

router.get('/', async (req, res) => {

    try {
        const products = await ProductModel.findAll();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

/*
LATER WE WILL ADD STORE KEYS AND THERE WILL BE AN ENDPOINT THAT GETS ALL THE PRODUCTS FROM A STORE

USER ID, STOREOWNER, AND STORE ID WILL ALL BE THE SAME NUMBER
*/

/*
============================================================
/product/:id GET (This displays a specific product)
============================================================
*/

router.get('/:productID', async (req, res) => {
    let { productID } = req.params;

    try {
        const product = await ProductModel.findAll({
            where: {
                id: productID
            }
        });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

/*
============================================================
/product/:id PUT (This updates a specific product)
============================================================
*/

router.put('/:productID', async (req, res) => {
    const {productName, price, description, stock} = req.body;
    let { productID } = req.params;
    // let { userID } = req.user;

    const query = {
        where: {
            id: productID
            // storeOwner : userID
        }
    };

    const newProduct = {
        productName,
        price,
        description,
        stock
    }

    try {
        const update = await ProductModel.update(newProduct, query);
        res.status(200).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

/*
============================================================
/product/:id DELETE (This deletes a specific product)
============================================================
*/

router.delete('/:productID', async (req, res) => {
    let { productID } = req.params;
    // { userID } = req.user

    try {
        const query = {
            where: {
                id: productID
                // storeOwner : userID
            }
        };

        await ProductModel.destroy(query);
        res.status(200).json({message: "Product deleted"});
    } catch (err) {
        res.status(500).json({error: err});
    }
})

module.exports = router;