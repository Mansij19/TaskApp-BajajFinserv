import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { CheckCircle, Circle, Trash2, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onComplete, onDelete }) => {
  const isHighPriority = task.priorityScore >= 50;
  const isCompleted = task.status === 'completed';

  const handleCompleteClick = () => {
    if (!isCompleted) {
      onComplete(task._id);
    }
  };

  const renderStars = (importance) => {
    return '⭐'.repeat(importance);
  };

  return (
    <div className={`task-card ${isHighPriority ? 'high-priority' : ''} ${isCompleted ? 'completed' : ''}`}>
      {isHighPriority && !isCompleted && (
        <div className="badge-high-priority">High Priority</div>
      )}
      
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="score-display" title="Priority Score">
          {task.priorityScore}
        </div>
      </div>
      
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}
      
      <div className="task-meta">
        <div className="meta-item">
          <span className="label">Importance:</span>
          <span>{renderStars(task.importance)}</span>
        </div>
        <div className="meta-item">
          <span className="label">Due:</span>
          <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')} ({formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })})</span>
        </div>
        <div className="meta-item">
          <span className="label">Status:</span>
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
            {task.status}
          </span>
        </div>
      </div>
      
      <div className="task-actions">
        <button 
          className={`btn ${isCompleted ? 'btn-success' : ''}`}
          onClick={handleCompleteClick}
          disabled={isCompleted}
          style={{ background: isCompleted ? 'var(--success-color)' : 'var(--primary-color)' }}
        >
          {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </button>
        <button 
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete(task._id);
            }
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
