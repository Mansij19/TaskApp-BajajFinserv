const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true,
    default: ''
  },
  importance: {
    type: Number,
    required: [true, 'Importance is required'],
    min: [1, 'Importance must be at least 1'],
    max: [5, 'Importance cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Importance must be an integer'
    }
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(v) {
        // Only validate future date on creation, not on update unless due date is modified
        if (this.isNew || this.isModified('dueDate')) {
          // Setting time to 00:00:00 to only compare dates if needed, but exact comparison is fine.
          return v > new Date(); 
        }
        return true;
      },
      message: 'Due date must be a future date'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// We don't store priorityScore, we will compute it at read time in the controller.

module.exports = mongoose.model('Task', taskSchema);
