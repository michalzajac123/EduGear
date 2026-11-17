import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'edugear-super-secret-key-2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Brak tokenu autoryzacji. Zaloguj się, aby uzyskać dostęp.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Sesja wygasła lub token jest nieprawidłowy. Zaloguj się ponownie.'
      });
    }

    req.user = decoded;
    next();
  });
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Wymagane uwierzytelnienie.'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Brak uprawnień. Dostęp tylko dla roli: ${role === 'caretaker' ? 'Opiekun pracowni' : role}.`
      });
    }

    next();
  };
};
