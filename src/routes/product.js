const express = require('express')
const router = express.Router();
const Product = require('../controller/product.js');
const { body, valiResult } = require('express-validator')

const productFile = "products.json";
const productObj = new Product(productFile);
const adm = true;

router.get("/", async (req, res) => {
  try {
    let aProduct = await productObj.getAll();
    res.status(200).json({
      aProduct,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }
    const id = parseInt(req.params.id);
    const product = await productObj.getById(id);
    return res.status(200).json({
      product,
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
});

router.post(
  "/",
  body("title").not().isEmpty().isString().trim().escape(),
  body("price").not().isEmpty().isDecimal({ min: 1.0 }),
  body("stock").not().isEmpty().isInt({ min: 1 }),
  async (req, res) => {
    try {
      if (!adm) {
        return res.status(403).json({
          error: -1,
          descripcion: "No autorizado",
        });
      }

      const errors = valiResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const body = req.body;
      await productObj.saveProduct(body);
      return res.status(201).json({
        msg: "Producto guardado",
      });
    } catch (error) {
      return res.status(400).json({
        error: error,
      });
    }
  }
);

router.put(
  "/:id",
  body("title").not().isEmpty().isString().trim().escape(),
  body("price").not().isEmpty().isDecimal({ min: 1.0 }),
  body("stock").not().isEmpty().isInt({ min: 1 }),
  async (req, res) => {
    try {
      if (!adm) {
        return res.status(403).json({
          error: -1,
          descripcion: "No autorizado",
        });
      }

      const errors = valiResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      if (isNaN(req.params.id)) {
        return res.status(400).json({
          error: "ID inválido",
        });
      }

      const id = parseInt(req.params.id);
      const body = req.body;

      await productObj.updateProduct(id, body);
      return res.status(200).json({
        msg: "Producto atualizado",
      });
    } catch (error) {
      return res.status(400).json({
        error: error,
      });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    if (!adm) {
      return res.status(403).json({
        error: -1,
        descripcion: "No autorizados",
      });
    }

    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "ID inválido!",
      });
    }
    const id = parseInt(req.params.id);
    await productObj.deleteById(id);
    return res.status(200).json({
      msg: "Producto elimindo",
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
});

module.exports = router;