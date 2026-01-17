import Tasks from "../../models/tasks";

import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    const { title, description, dueDate, priority, status, userId } = req.body;
    try {
        const newTask = new Tasks({
            title,
            description,
            dueDate,
            priority,
            status,
            userId
        });
        await newTask.save();
        return res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding task', error: error.message });
    }
});
export default () => router;