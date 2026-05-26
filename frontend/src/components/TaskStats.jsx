import React from 'react';

const TaskStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stats-dashboard">
      <div className="stat-card">
        <div className="stat-value">{stats.totalTasks || 0}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" style={{ color: 'var(--success-color)' }}>
          {stats.completedTasks || 0}
        </div>
        <div className="stat-label">Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" style={{ color: '#fbbf24' }}>
          {stats.pendingTasks || 0}
        </div>
        <div className="stat-label">Pending</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" style={{ color: 'var(--danger-color)' }}>
          {stats.overdueTasks || 0}
        </div>
        <div className="stat-label">Overdue</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">
          {stats.averageImportance || 0} <span style={{ fontSize: '1rem' }}>/ 5</span>
        </div>
        <div className="stat-label">Avg Importance</div>
      </div>
    </div>
  );
};

export default TaskStats;
