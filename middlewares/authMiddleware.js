const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign({ user: user.id }, 'tu_secreto_es_secreto', {
    expiresIn: '1h',
  });
}

function verifyToken(req, res, next) {
  const token = req.session.token; // Tomar el token de la sesión
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no generado' });
  }

  jwt.verify(token, 'tu_secreto_es_secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
    req.user = decoded.user; // Almacenar la información decodificada
    next(); 
  });
}

module.exports = { generateToken, verifyToken };

  