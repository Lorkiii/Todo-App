import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/users.js';

const router = express.Router();

// GET /api/auth/verify - Verify JWT token from HttpOnly cookie and return user info
router.get('/verify', async (req, res) => {
    try {
        // Get token from HttpOnly cookie
        const token = req.cookies.taskflow_token;

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token required' 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
            if (err) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Invalid or expired token' 
                });
            }

            // Find user and populate with task count
            User.findById(decoded.userId).populate('tasks')
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ 
                            success: false,
                            message: 'User not found' 
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Token verified successfully',
                        user: {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            taskCount: user.tasks ? user.tasks.length : 0
                        }
                    });
                })
                .catch(error => {
                    res.status(500).json({ 
                        success: false,
                        message: 'Database error',
                        error: error.message 
                    });
                });
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error during token verification',
            error: error.message 
        });
    }
});

export default () => router;
