const Task = require('../models/Task');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Check for weekly reset (assuming week starts on Monday)
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Reset tasks completed in previous weeks
    await Task.updateMany(
      { 
        user: req.user.id, 
        completed: true, 
        lastCompletedAt: { $lt: startOfWeek, $ne: null } 
      },
      { 
        $set: { completed: false, lastCompletedAt: null } 
      }
    );

    const tasks = await Task.find({ user: req.user.id }).sort({ time: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { dayOfWeek, time, title, description, priority } = req.body;

    if (!dayOfWeek || !time || !title) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    const task = await Task.create({
      user: req.user.id,
      dayOfWeek,
      time,
      title,
      description,
      priority: priority || 'Medium'
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    if (req.body.completed === true) {
      req.body.lastCompletedAt = new Date();
    } else if (req.body.completed === false) {
      req.body.lastCompletedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
