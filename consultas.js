require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const insertarUsuario = async (nombre, balance) => {
  balance = parseFloat(balance);
  const values = [nombre, balance];
  const consulta = {
    text: `INSERT INTO usuarios (nombre, balance) VALUES ($1, $2)`,
    values: values,
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const realizarTransferencia = async (emisor, receptor, monto) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // Realizar las operaciones de transferencia
    // Ejemplo: actualizar saldos de emisor y receptor
    const updateEmisorQuery = {
      text: `UPDATE usuarios SET balance = balance - $1 WHERE id = $2`,
      values: [monto, emisor],
    };
    const updateReceptorQuery = {
      text: `UPDATE usuarios SET balance = balance + $1 WHERE id = $2`,
      values: [monto, receptor],
    };
    const insertTransferenciaQuery = {
      text: `INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
      values: [emisor, receptor, monto],
    };

    await client.query(updateEmisorQuery);
    await client.query(updateReceptorQuery);
    await client.query(insertTransferenciaQuery);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

const obtenerUsuarios = async () => {
  try {
    const result = await pool.query(`SELECT id, nombre, balance FROM usuarios`);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const actualizarUsuario = async (id, nombre, balance) => {
  const values = [nombre, balance, id];
  const consulta = {
    text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3`,
    values: values,
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const eliminarUsuario = async (id) => {
  try {
    const result = await pool.query(`DELETE FROM usuarios WHERE id = $1`, [id]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const obtenerTransferencias = async () => {
  try {
    const result = await pool.query(
      `SELECT id, emisor, receptor, monto, fecha FROM transferencias`
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  insertarUsuario,
  realizarTransferencia,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  obtenerTransferencias,
};
