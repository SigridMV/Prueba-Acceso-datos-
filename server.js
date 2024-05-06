const express = require("express");
const app = express();
const {
  insertarUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  realizarTransferencia,
  obtenerTransferencias,
} = require("./consultas");

// Middleware para manejar solicitudes JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/usuario", async (req, res) => {
  const { nombre, balance } = req.body;
  try {
    await insertarUsuario(nombre, balance);
    res.sendStatus(201); // Usuario creado con éxito
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Error del servidor
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Error del servidor
  }
});

app.put("/usuario", async (req, res) => {
  const { id, nombre, balance } = req.body;
  try {
    await actualizarUsuario(id, nombre, balance);
    res.sendStatus(200); // Usuario actualizado con éxito
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Error del servidor
  }
});

app.delete("/usuario", async (req, res) => {
  const { id } = req.body;
  try {
    await eliminarUsuario(id);
    res.sendStatus(200); // Usuario eliminado con éxito
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Error del servidor
  }
});

app.post("/transferencia", async (req, res) => {
  const { emisor, receptor, monto } = req.body;
  try {
    await realizarTransferencia(emisor, receptor, monto);
    res.sendStatus(200); // Transferencia realizada con éxito
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Error del servidor
  }
});

app.get("/transferencias", async (req, res) => {
  try {
    const transferencias = await obtenerTransferencias();
    res.json(transferencias);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Error del servidor
  }
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
