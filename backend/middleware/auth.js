const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No clearance provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied: Invalid clearance protocol' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_hackathon_demo';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Access denied: Intelligence clearance expired or invalid' });
  }
};

module.exports = authMiddleware;
