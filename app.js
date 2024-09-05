const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const middlewares = require('./middlewares/authMiddleware');
const routes = require('./routes/users');

const app = express();
const PORT = 3000;

// Configuración para manejar datos en formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'tu_secreto_es_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

// Configura las rutas de usuarios
routes(app); 


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
