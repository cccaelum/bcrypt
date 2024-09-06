const express = require('express');
const session = require('express-session');
const { secret } = require('./crypto/config');  

const routes = require('./routes/users');

const app = express();
const PORT = 3000;

// para manejar datos en formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

// configura las rutas
routes(app); 


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
