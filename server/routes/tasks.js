import express from 'express';
import Tasks from '../../models/tasks.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token and get user ID
const authenticateToken = (req, res, next) => {
    const token = req.cookies.taskflow_token;

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = decoded.userId;
        next();
    });
};

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await Tasks.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json({
            success: true,
            message: 'Tasks retrieved successfully',
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving tasks',
            error: error.message
        });
    }
});

// POST /api/tasks - Create a new task for the authenticated user
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        // Validate required fields
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const newTask = new Tasks({
            user: req.userId,
            title: title.trim(),
            description: description ? description.trim() : '',
            dueDate: dueDate ? new Date(dueDate) : null,
            status: 'pending'
        });

        const savedTask = await newTask.save();
        
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: savedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating task',
            error: error.message
        });
    }
});

// PUT /api/tasks/:id - Update a task (only if it belongs to the authenticated user)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const taskId = req.params.id;

        // Find task and verify it belongs to the user
        const task = await Tasks.findOne({ _id: taskId, user: req.userId });
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        // Update fields
        if (title !== undefined) task.title = title.trim();
        if (description !== undefined) task.description = description.trim();
        if (status !== undefined) task.status = status;
        if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

        task.updatedAt = new Date();
        const updatedTask = await task.save();

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
});

// DELETE /api/tasks/:id - Delete a task (only if it belongs to the authenticated user)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find and delete task (only if it belongs to the user)
        const deletedTask = await Tasks.findOneAndDelete({ _id: taskId, user: req.userId });
        
        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Task deleted successfully',
            data: deletedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
});

// PATCH /api/tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find task and verify it belongs to the user
        const task = await Tasks.findOne({ _id: taskId, user: req.userId });
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        // Toggle status between 'pending' and 'completed'
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        task.updatedAt = new Date();
        
        const updatedTask = await task.save();

        res.json({
            success: true,
            message: `Task marked as ${task.status}`,
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling task status',
            error: error.message
        });
    }
});

// GET /api/tasks/stats - Get task statistics for the authenticated user
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        const stats = await Tasks.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalTasks = await Tasks.countDocuments({ user: userId });
        const completedToday = await Tasks.countDocuments({
            user: userId,
            status: 'completed',
            updatedAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        });

        const statsObj = {
            total: totalTasks,
            pending: 0,
            inProgress: 0,
            completed: 0,
            completedToday: completedToday
        };

        stats.forEach(stat => {
            if (stat._id === 'pending') statsObj.pending = stat.count;
            if (stat._id === 'in-progress') statsObj.inProgress = stat.count;
            if (stat._id === 'completed') statsObj.completed = stat.count;
        });

        res.json({
            success: true,
            message: 'Task statistics retrieved successfully',
            data: statsObj
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving task statistics',
            error: error.message
        });
    }
});

export default () => router;