require("dotenv").config();
const Express = require('express');
const app = Express();
const controllers = require("./controllers");
const dbConnection = require("./db");

app.use(Express.json());
app.use("/user", controllers.userController);
app.use("/product", controllers.productController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on ${process.env.PORT}`));
    })
    .catch((err) => console.log(`[Server]: Server crashed due to ${err}`))