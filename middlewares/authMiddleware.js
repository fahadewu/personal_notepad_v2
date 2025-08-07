const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '98vyt3n9v38v4nt3n9tv930nt4v3nt9p3 m eg eomlgecg,oqmrglhewohm';

const authMiddleware = (req, res, next) => {
  const accessToken = req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(accessToken, JWT_SECRET);
    req.token = verified.token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;