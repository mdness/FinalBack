const fs = require('fs');
const moment = require('moment');

class Cart {
  constructor(cartFile) {
    this.cartFile = cartFile;
  }

  async existFile() {
    try {
      await fs.promises.stat(this.cartFile);
      return true;
    } catch (error) {
      console.log("El archivo no existe");
      await fs.promises.writeFile(this.cartFile, JSON.stringify([]));
      return false;
    }
  }

  async newFile() {
    try {
      let defCart = [
        {
          id: 1,
          products: [
            {
              id: 1,
              timestamp: "09-11-22 19:15:10",
              title: "Mordillo",
              price: 350,
              stock: 30,
            },
            {
              id: 2,
              timestamp: "09-11-22 19:16:40",
              title: "Juguete Kong",
              price: 550,
              stock: 15,
            },
            {
              id: 3,
              timestamp: "09-11-22 19:17:15",
              title: "Pelota de caucho",
              price: 120,
              stock: 40,
            },
          ],
        },
      ];
      const data = JSON.stringify(defCart, null, "\t");
      await fs.promises.writeFile(this.cartFile, data);
    } catch (error) {
      throw new Error("No se pudo cargar el carrito", error);
    }
  }

  async getAllProducts() {
    try {
      let fileExist = await this.existFile();
      if (!fileExist) {
        await this.newFile();
      }
      const data = await fs.promises.readFile(this.cartFile, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("No se pudieron obtener los productos", error);
    }
  }

  async saveCart(cart) {
    try {
      const data = JSON.stringify(cart, null, "\t");
      await fs.promises.writeFile(this.cartFile, data);
    } catch (error) {
      throw new Error("No se pudo guardar", error);
    }
  }

  async getCartById(id) {
    try {
      const cartProducts = await this.getAllProducts();
      const index = cartProducts.findIndex((cart) => cart.id === id);
      if (index < 0) {
        const existeProd = {
          index: index,
          msg: "El carrito no existe",
        };
        throw existeProd;
      }
      return cartProducts[index];
    } catch (error) {
      throw error;
    }
  }

  async createCart() {
    try {
      const cart = await this.getAllProducts();
      let id = 1;
      if (cart.length) {
        id = cart[cart.length - 1].id + 1;
      }

      const newCart = {
        id: id,
        timestamp: moment().format("DD-MM-YYYY HH:MM:SS"),
        products: [],
      };

      cart.push(newCart);

      await this.saveCart(cart);
    } catch (error) {
      throw new Error("Error al crear el carrito", error);
    }
  }

  async deleteAll() {
    try {
      await this.saveProducts([]);
    } catch (error) {
      throw new Error("No se pudieron borrar los productos", error);
    }
  }

  async deleteById(id) {
    try {
      const cart = await this.getAllProducts();

      const index = cart.findIndex((cart) => cart.id === id);

      if (index < 0) {
        throw "El carrito a eliminar no existe!";
      }

      cart.splice(index, 1);

      await this.saveCart(cart);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(idCart, idProduct) {
    try {
      const cart = await this.getAllProducts();
      const indexCart = cart.findIndex((cart) => cart.id === idCart);

      const indexProduct = cart[indexCart].products.findIndex(
        (product) => product.id === idProduct
      );

      if (indexProduct < 0) {
        throw "El producto buscado no existe en el carrito";
      }

      cart[indexCart].products.splice(indexProduct, 1);

      await this.saveCart(cart);
    } catch (error) {
      throw error;
    }
  }

  async addProduct(idCart, product) {
    try {
      const cart = await this.getAllProducts();
      const index = cart.findIndex((cart) => cart.id === idCart);
      cart[index].products.push(product);
      await this.saveCart(cart);
    } catch (error) {
      throw new Error("No se pudo agregar el producto", error);
    }
  }
}

module.exports = Cart