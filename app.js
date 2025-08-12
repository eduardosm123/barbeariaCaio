
const express = require('express');
const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    // Reflete a origem — funciona com credentials
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    req.header('Access-Control-Request-Headers') || 'Content-Type, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    req.header('Access-Control-Request-Method') || 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

// monte suas rotas normalmente:
const routes = require('./routes/router');
app.use('/', routes);

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Servidor Online na porta ${PORT}!!`)
})