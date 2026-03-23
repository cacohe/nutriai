import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nutriai-secret-key-2024';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '请先登录' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: '登录已过期，请重新登录' });
        }
        req.user = user;
        next();
    });
};

export default { authenticateToken };