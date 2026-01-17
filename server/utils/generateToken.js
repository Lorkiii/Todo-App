import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
    const payload = {
        userId: userId,
        iat: Math.floor(Date.now() / 1000) // Issued at time
    };

    const options = {
        expiresIn: '24h', // Token expires in 24 hours
        issuer: 'taskflow-app'
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', options);
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
