import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const TaskForm = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: 3,
    dueDate: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importance' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (formData.title.length < 3 || formData.title.length > 100) {
      setError('Title must be between 3 and 100 characters.');
      return;
    }
    
    if (formData.description.length > 500) {
      setError('Description cannot exceed 500 characters.');
      return;
    }
    
    if (!formData.dueDate) {
      setError('Due date is required.');
      return;
    }
    
    const due = new Date(formData.dueDate);
    const now = new Date();
    // Reset time for today to allow today's dates if needed, but strict future is asked.
    // "must be a future date on creation"
    if (due <= now) {
      setError('Due date must be in the future.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Create New Task</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Submit project report"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional details about the task..."
            />
          </div>
          
          <div className="form-group">
            <label>Importance (1-5) <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                name="importance"
                min="1"
                max="5"
                value={formData.importance}
                onChange={handleChange}
                style={{ flexGrow: 1 }}
              />
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.importance}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Due Date <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          {error && <div className="error-text">{error}</div>}
          
          <div className="form-actions">
            <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={isLoading}>
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
