import express from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import User from '../../models/users.js';

const router = express.Router();


// POST /api/login - Authenticate user and set HttpOnly cookie
router.post('/', async (req, res) => {
    console.log('Login POST request received:', req.body);
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Set HttpOnly cookie with JWT token
        res.cookie('taskflow_token', token, {
            httpOnly: true,        // Prevents JavaScript access
            secure: false,         // Set to true in production with HTTPS
            sameSite: 'lax',      // CSRF protection
            maxAge: 24 * 60 * 60 * 1000  // 24 hours in milliseconds
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

export default () => router;
