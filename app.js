import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

app.get('/', (req, res) => {
  res.send(
    `<h1>Welcome to the Express Server V2!</h1>
    <p>This is a simple Express server running on port ${PORT}.</p>`
  )
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.send(`<h1>User ID: ${id}</h1>`);
});


app.get('/search', (req, res) => {
  const term  = req.query.termino || 'No search term provided';
  const searchTerm = req.query.categoria || 'No category provided';
  res.send(`<h1>Search Term: ${term}</h1><h2>Category: ${searchTerm}</h2>`);
});


//procesar formulario
app.post('/form', (req, res) => {
  const { name, email } = req.body;
  res.json({ 
    message: "datos recibidos correctamente",
    data: { name, email }
  });
});


app.post('/api/data', (req, res) => {
  const data = req.body;
  if(!data || Object.keys(data).length ===0 ){
    return res.status(400).json({
      error: 'No se recibieron datos'
    });
  }

  res.status(201).json({
    message:"Datps recibidos",
    data
  })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});