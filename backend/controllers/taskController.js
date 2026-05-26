const Task = require('../models/Task');
const mongoose = require('mongoose');

// Helper to calculate priority score
const calculatePriorityScore = (task) => {
  if (task.status === 'completed') return 0;

  const now = new Date();
  const due = new Date(task.dueDate);
  // Full days between now and due date, rounded down
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const daysUntilDue = Math.max(diffDays, 1);
  const score = (task.importance * 10) + (100 / daysUntilDue);
  
  return Number(score.toFixed(2));
};

// Transform task document to include priorityScore
const transformTask = (doc) => {
  const task = doc.toObject ? doc.toObject() : doc;
  task.priorityScore = calculatePriorityScore(task);
  return task;
};

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(transformTask(savedTask));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, minImportance } = req.query;
    let query = {};
    
    if (status && ['pending', 'completed'].includes(status)) {
      query.status = status;
    }
    if (minImportance && !isNaN(minImportance)) {
      query.importance = { $gte: Number(minImportance) };
    }

    const tasks = await Task.find(query);
    
    // Add priorityScore and sort
    const tasksWithScores = tasks.map(transformTask).sort((a, b) => b.priorityScore - a.priorityScore);
    
    res.status(200).json(tasksWithScores);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }

    // Since dueDate validation is strict on creation, we use runValidators
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(transformTask(task));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Bonus: Aggregation pipeline
exports.getStats = async (req, res) => {
  try {
    const now = new Date();
    
    const stats = await Task.aggregate([
      {
        $facet: {
          "totals": [
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                pendingTasks: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                },
                completedTasks: {
                  $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                },
                totalImportance: { $sum: "$importance" },
                overdueTasks: {
                  $sum: {
                    $cond: [
                      { $and: [
                        { $eq: ["$status", "pending"] },
                        { $lt: ["$dueDate", now] }
                      ]},
                      1, 0
                    ]
                  }
                }
              }
            }
          ],
          "importanceCounts": [
            {
              $group: {
                _id: "$importance",
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0];
    
    if (result.totals.length === 0) {
      return res.status(200).json({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        averageImportance: 0,
        overdueTasks: 0,
        tasksByImportance: {}
      });
    }

    const totals = result.totals[0];
    const avgImportance = totals.totalTasks > 0 ? (totals.totalImportance / totals.totalTasks) : 0;
    
    const tasksByImportance = {};
    // Ensure all 1-5 keys exist
    for (let i = 1; i <= 5; i++) {
      tasksByImportance[i] = 0;
    }
    result.importanceCounts.forEach(item => {
      tasksByImportance[item._id] = item.count;
    });

    res.status(200).json({
      totalTasks: totals.totalTasks,
      pendingTasks: totals.pendingTasks,
      completedTasks: totals.completedTasks,
      averageImportance: Number(avgImportance.toFixed(2)),
      overdueTasks: totals.overdueTasks,
      tasksByImportance
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
