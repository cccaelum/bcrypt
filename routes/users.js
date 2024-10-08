const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const users = require('../data/users');  

const setup = (app) => {
  app.get('/', (req, res) => {
    // verificar si el usuario ya ha iniciado sesión
    if (req.session.token) {
      const dashboardPage = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inicio</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
            }
            .login-container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 100%;
                text-align: center;
            }
            button {
                width: 100%;
                background-color: #444444;
                color: white;
                padding: 5px;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                margin-top: 10px;
            }
            a.dashboard-link {
                display: block;
                margin-top: 20px;
                color: #007bff;
                text-decoration: none;
            }
        </style>
      </head>
      <body>
        <div class="login-container">
          <h2>Ya has iniciado sesión</h2>
          <a href="/dashboard" class="dashboard-link">Ir al Dashboard</a>
          <form action="/logout" method="post">
            <button type="submit">Cerrar sesión</button>
          </form>
        </div>
      </body>
      </html>
      `;
      res.send(dashboardPage);
    } else { // si no hay sesión iniciada, se muestra el formulario
    const loginform = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
            }
            .login-container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 100%;
            }
            input[type="text"],
            input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                margin-bottom: 10px;
            }
            button {
                width: 100%;
                background-color: #444444;
                color: white;
                padding: 5px;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
            }
            .dashboard-link {
                display: block;
                padding: 10px;
                text-align: center;
                color: #007bff;
                text-decoration: none;
            }
    </style>
    </head>
    <body>
      <div class="login-container">
      <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>
    
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br>
    
        <button type="submit">Iniciar sesión</button>
      </form>
      <a href="/dashboard" class="dashboard-link">Dashboard</a>
      </div>
    </body>
    </html>
    `;
    res.send(loginform);
    }
  });

  // autenticar al usuario y generar un token JWT
  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // buscar al usuario en el array
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      const token = generateToken(user);
      req.session.token = token;
      res.redirect('/dashboard');
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });

  // Ruta GET /dashboard
  app.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);
    if (user) {
      res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
        <style>
        body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
            }
        .dashboard-container {
                background-color: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                width: 100%;
                text-align: center;
            }
          h1 {
                color: #333;
            }
          p {
                color: #555;
            }
          .logout-btn {
                width: 100%;
                background-color: #444444;
                color: white;
                padding: 5px;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                margin-top: 10px;
            }
            .home-link{
                display: block;
                padding: 10px;
                text-align: center;
                color: #007bff;
                text-decoration: none;
            }
        </style>
     </head>
      <body>
        <div class="dashboard-container">
        <h1>Hola, ${user.name}</h1>
        <p>ID: ${user.id}</p>
        <p>Username: ${user.username}</p>
        <a href="/" class="home-link">Volver a Inicio</a>
        <form action="/logout" method="post">
        <button class="logout-btn" type="submit">Cerrar sesión</button>
        </form>
        </div>
      </body>
    </html>
        `);
    } else {
      res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
  });

  // Ruta POST /logout
  app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
};

module.exports = setup;

