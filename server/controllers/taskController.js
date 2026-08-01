const Task = require('../models/Task');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ time: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
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
