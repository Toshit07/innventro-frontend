import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Enhanced authentication middleware
export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No authentication token provided',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure token is an access token
    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({
        message: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    res.status(401).json({
      message: 'Invalid or malformed token',
      code: 'INVALID_TOKEN'
    });
  }
};

// Admin role verification
export const adminOnly = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Administrative access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  });
};

// Optional authentication - doesn't fail if no token, but verifies if one exists
export const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.type === 'access' || !decoded.type) {
        req.user = decoded;
      }
    } catch (error) {
      console.warn('Optional auth token validation failed:', error.message);
    }
  }

  next();
};
