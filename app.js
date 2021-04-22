const Express = require('express');
const app = Express();

app.use('/test', (req,res) => {
    res.send('This is a message from the test endpoint on the server.')
});

const controllers = require("./controllers");

app.use("/user", controllers.userController);
app.use("/product", controllers.productController);

app.listen(3500, () => {
    console.log('[Server]: App is listening on 3500.');
});