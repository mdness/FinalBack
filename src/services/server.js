const express = require('express');
const mainRouter = require('../routes/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    error: -2,
    descripcion: "Error",
  });
});

module.exports = app;
