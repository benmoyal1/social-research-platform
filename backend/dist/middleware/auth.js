import jwt from 'jsonwebtoken';
// Secret key for JWT - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRATION = '3h'; // 3 hours to match session duration
/**
 * Generate JWT token for authenticated user
 */
export function generateToken(username) {
    const payload = { username, timestamp: Date.now() };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}
/**
 * Verify JWT token
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}
/**
 * Authentication middleware
 * Protects routes by requiring valid JWT token
 */
export function authenticateToken(req, res, next) {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({
            error: 'Access denied. No token provided.',
            message: 'Authentication required. Please log in.'
        });
        return;
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(403).json({
            error: 'Invalid or expired token.',
            message: 'Your session has expired. Please log in again.'
        });
        return;
    }
    // Attach user info to request
    req.user = decoded;
    next();
}
/**
 * Optional: Middleware to check if token is about to expire
 * Useful for implementing token refresh
 */
export function checkTokenExpiration(req, res, next) {
    if (req.user && req.user.exp) {
        const tokenExp = req.user.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = tokenExp - now;
        // If token expires in less than 30 minutes, send a header to notify frontend
        if (timeUntilExpiry < 30 * 60 * 1000) {
            res.setHeader('X-Token-Expiring-Soon', 'true');
        }
    }
    next();
}
//# sourceMappingURL=auth.js.map