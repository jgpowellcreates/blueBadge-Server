require("dotenv").config();
const Express = require('express');
const app = Express();
const controllers = require("./controllers");
const dbConnection = require("./db");

app.use(Express.json());

app.use(require('./middleware/headers'));

app.use("/user", controllers.userController);
app.use("/product", controllers.productController);
app.use("/store", controllers.storeController);

dbConnection.authenticate()
    .then(async () => await dbConnection.sync({}))
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on ${process.env.PORT}`));
    })
    .catch((err) => console.log(`[Server]: Server crashed due to ${err}`))