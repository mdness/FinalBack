const express = require('express');
const router = express.Router();
const Cart = require('../controller/cart.js');
const Product = require('../controller/product.js');
const { body, valiResult } = require('express-validator');

const cartFile = "cart.json";
const cartObj = new Cart(cartFile);
const productFile = "products.json";
const productObj = new Product(productFile);

router.get("/:id/productos", async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "ID no valido",
      });
    }
    const id = parseInt(req.params.id);
    const productCart = await cartObj.getcartById(id);
    return res.status(200).json({
      productCart,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    await cartObj.createcart();
    const cartGet = await cartObj.getAllproductsIncart();
    let cartID = cartGet[cGetAll.length - 1].id;
    return res.status(201).json({
      msg: "Creado",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.post( "/:id/productos", body("id").not().isEmpty().isInt({ min: 1 }),
  async (req, res) => {
    try {
      if (isNaN(req.params.id)) {
        return res.status(400).json({
          error: "Ese ID no existe",
        });
      }

      const errors = valiResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const cartID = parseInt(req.params.id);
      const productID = parseInt(req.body.id);
      const cartSelected = await cartObj.getcartById(cartID);
      const productToAdd = await productObj.getById(productID);
      await cartObj.addProductCart(cartSelected.id, productToAdd);
      return res.status(201).json({
        msg: "Producto eliminado",
      });
    } catch (error) {
      if (error.index) {
        return res.status(404).json({
          error: error.msg,
        });
      } else {
        return res.status(400).json({
          error: error,
        });
      }
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "ID inválido!",
      });
    }
    const id = parseInt(req.params.id);
    await cartObj.deleteById(id);
    return res.status(200).json({
      msg: "Carrito eliminado",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.delete("/:id/productos/:idprod", async (req, res) => {
  try {
    if (isNaN(req.params.id) || isNaN(req.params.id_prod)) {
      return res.status(400).json({
        error: "Inválido",
      });
    }
    const cartID = parseInt(req.params.id);
    const productID = parseInt(req.params.id_prod);
    const cart = await cartObj.getcartById(cartID);
    await cartObj.deleteproductIncartById(cartID, productID);
    return res.status(200).json({
      msg: "Producto eliminado",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

module.exports = router;