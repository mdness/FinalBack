const server = require('./services/server.js')
const port = 8080;

server.listen(port, () => console.log(`Server up in: http://localhost:${port}`));

server.on("error", (error) => {
  console.log("Error en servidor", error);
});