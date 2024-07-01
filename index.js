const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const config = require('./config');

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
const app = express();
const port = config.port;

const pool = new Pool({
  connectionString: config.urlConnection
});

var conString = config.urlConnection;
var client = new Client(conString);
client.connect( (err) => {
 if(err) {
 return console.error('Não foi possível conectar ao banco.', err);
 }
 client.query('SELECT NOW()', (err, result) => {
 if(err) {
 return console.error('Erro ao executar a query.', err);
 }
 console.log(result.rows[0]);
 });
});

app.get("/", (req, res) => {
  console.log("Response ok.");
  res.send("Ok – Servidor disponível.");
 });

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