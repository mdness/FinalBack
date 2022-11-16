const {Router} = require('express');
const Product = require('./product.js');
const Cart = require('./cart.js') 

const mainRouter = Router();

mainRouter.use("/productos", Product);
mainRouter.use("/carrito", Cart);

module.exports = mainRouter;