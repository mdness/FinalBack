const fs = require('fs');
const moment = require('moment');

class Product {
  constructor(productFile) {
    this.productFile = productFile;
  }

  async validateExistFile() {
    try {
      await fs.promises.stat(this.productFile);
      return true;
    } catch (error) {
      console.log("El archivo no existe");
      await fs.promises.writeFile(this.productFile, JSON.stringify([]));
      return false;
    }
  }

  async newFile() {
    try {
      let defProducts = [
        {
          id: 1,
          products: [
            {
              id: 1,
              timestamp: "09-11-22 19:15:10",
              title: "Cama para perrito mediano",
              price: 350,
              stock: 30,
            },
            {
              id: 2,
              timestamp: "09-11-22 19:16:40",
              title: "Limpia patitas",
              price: 550,
              stock: 15,
            },
            {
              id: 3,
              timestamp: "09-11-22 19:17:15",
              title: "Pretal anti-tirones",
              price: 120,
              stock: 40,
            },
          ],
        },
      ];
      const data = JSON.stringify(defProducts, null, "\t");
      await fs.promises.writeFile(this.productFile, data);
    } catch (error) {
      throw new Error("No se pudieron cargar los productos", error);
    }
  }

  async getAll() {
    try {
      let fileExist = await this.validateExistFile();
      if (!fileExist) {
        await this.newFile();
      }
      const data = await fs.promises.readFile(this.productFile, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("No se pudieron obtener los productos", error);
    }
  }

  async productUp(id, body) {
    const products = await this.getAll();
    let up = false;

    try {
      products.forEach((product) => {
        if (product.id === id) {
          product.timestamp = moment().format("DD-MM-YYYY HH:MM:SS");
          product.title = body.title ? body.title : product.title;
          product.price = body.price;
          product.stock = body.stock;
          up = true;
        }
      });
      if (up) {
        await this.saveProducts(products);
      } else {
        throw "No existe el producto solicitado!";
      }
    } catch (error) {
      throw error;
    }
  }

  async saveProducts(products) {
    try {
      const data = JSON.stringify(products, null, "\t");
      await fs.promises.writeFile(this.productFile, data);
    } catch (error) {
      throw new Error("No se pudieron guardar los productos", error);
    }
  }

  async getById(id) {
    try {
      const products = await this.getAll();
      const index = products.findIndex((product) => product.id === id);
      if (index < 0) {
        const existeProd = {
          index: index,
          msg: "El producto no existe",
        };
        throw existeProd;
      }
      return products[index];
    } catch (error) {
      throw error;
    }
  }

  async saveProduct(data) {
    if (
      !data.title ||
      !data.price ||
      !data.stock ||
      typeof data.title !== "string" ||
      typeof data.price !== "number" ||
      typeof data.stock !== "number"
    )
      throw "Datos inválidos";

    try {
      const products = await this.getAll();
      let id = 1;
      if (products.length) {
        id = products[products.length - 1].id + 1;
      }

      const newProduct = {
        id: id,
        timestamp: moment().format("DD-MM-YYYY HH:MM:SS"),
        title: data.title,
        value: data.price,
        stock: data.stock,
      };

      products.push(newProduct);

      await this.saveProducts(products);
    } catch (error) {
      throw new Error(
        "No se pudo guardar el carrito",
        error
      );
    }
  }

  async deleteById(id) {
    try {
      const products = await this.getAll();

      const index = products.findIndex((product) => product.id === id);

      if (index < 0) {
        const existeProd = {
          index: index,
          msg: "El producto no existe",
        };
        throw existeProd;
      }

      products.splice(index, 1);

      await this.saveProducts(products);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;