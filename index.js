const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const config = require('./config');

const app = express();
const port = config.port;

const pool = new Pool({
  connectionString: config.urlConnection
});

app.use(cors());
app.use(express.json());

// Endpoint para obter todas as tarefas
app.get('/tarefas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Tarefas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Endpoint para adicionar uma nova tarefa
app.post('/tarefas', async (req, res) => {
  const { tarefa, segunda, terca, quarta, quinta, sexta, sabado, domingo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Tarefas (tarefa, segunda, terca, quarta, quinta, sexta, sabado, domingo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [tarefa, segunda, terca, quarta, quinta, sexta, sabado, domingo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
module.exports = app;