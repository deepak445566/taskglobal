const Task = require('../models/Task');

// Sab tasks get kare
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Ek task get kare
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Naya task create kare
exports.createTask = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.title || req.body.title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Title is required' 
      });
    }

    const task = new Task({
      title: req.body.title,
      description: req.body.description || '',
      priority: req.body.priority || 'medium'
    });

    const savedTask = await task.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Task update kare
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Sirf allowed fields update kare
    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.priority !== undefined) task.priority = req.body.priority;

    const updatedTask = await task.save();
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Task delete kare
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};