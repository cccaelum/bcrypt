const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const users = require('../data/users');  // Importar los usuarios

const setup = (app) => {
  // Ruta GET para mostrar el formulario de inicio de sesión
  app.get('/', (req, res) => {
    const loginform = `
      <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>
    
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br>
    
        <button type="submit">Iniciar sesión</button>
      </form>
      <a href="/dashboard">dashboard</a>
    `;
    res.send(loginform);
  });

  // Ruta POST /login: Para autenticar al usuario y generar un token JWT
  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Buscar al usuario en el arreglo de usuarios
    const user = users.find(u => u.username === username && u.password === password);

    // Si no se encuentra el usuario o las credenciales son incorrectas
    if (!user) {
      return res.status(401).json({ Mensaje: 'Credenciales inválidas' });
    }

    // Si las credenciales son válidas, generar un token JWT
    const token = generateToken({ id: user.id });

    // Guardar el token en la sesión
    req.session.token = token;

    // Devolver respuesta exitosa con el token
    return res.json({ Mensaje: 'Autenticado correctamente', token });
  });

  // Ruta GET /dashboard: Protegida con el middleware verifyToken
  app.get('/dashboard', verifyToken, (req, res) => {
    res.send(`<h1>Bienvenido al panel de control, usuario ID: ${req.user}</h1>`);
  });

  // Ruta POST /logout: Para cerrar sesión y destruir la sesión
  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ Mensaje: 'Error al cerrar sesión' });
      }
      res.json({ Mensaje: 'Sesión cerrada' });
    });
  });
};

module.exports = setup;

