
const express = require('express'); 
require('dotenv').config();

const app = express();

const cors = require('cors');

const allowlist = [
  'https://www.barbeariavip.site',
  'https://barbeariavip.site'
];

const corsOptions = (req, cb) => {
  const origin = req.header('Origin');
  const isAllowed = !origin || allowlist.includes(origin); // permite curl/healthcheck sem Origin
  cb(null, {
    origin: isAllowed ? origin : false,   // ecoa a origem quando permitido
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
    credentials: false,                    // coloque true só se usar cookies/sessão
    optionsSuccessStatus: 204,
    maxAge: 86400
  });
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// Middleware adicional para garantir CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// DB connection
const conn = require("./db/conn");
conn();

// monte suas rotas normalmente:
const routes = require('./routes/router');
app.use('/', routes);

// Rota de teste
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Barbearia VIP Backend - Servidor funcionando!', 
        timestamp: new Date().toISOString(),
        cors: 'enabled for all origins',
        endpoints: {
            auth: ['POST /auth/login', 'POST /auth/logout', 'GET /auth/verify'],
            admin: ['GET /admin', 'GET /admin/:id', 'POST /admin', 'PATCH /admin/:id', 'DELETE /admin/:id'],
            horarios: ['GET /horarios', 'PATCH /horarios'],
            agendamentos: ['GET /agendamentos', 'POST /agendamentos', 'GET /agendamentos/:id', 'PATCH /agendamentos/:id', 'DELETE /agendamentos/:id']
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Servidor Online na porta ${PORT}!!`)
})