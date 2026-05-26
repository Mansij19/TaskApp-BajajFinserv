import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import * as api from './services/api';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [minImportance, setMinImportance] = useState(1);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, statsData] = await Promise.all([
        api.getTasks(statusFilter, minImportance),
        api.getStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load data. Please check if the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, minImportance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      await api.createTask(taskData);
      await fetchData(); // Refresh list and stats
      setIsFormOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await api.updateTask(id, { status: 'completed' });
      // Optimistic update for task list could be done, but refetching is safer for stats update too
      await fetchData();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      await fetchData();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>TaskFlow</h1>
        <p>Smart Task Manager with Priority Scoring</p>
      </header>

      {stats && <TaskStats stats={stats} />}

      <div className="controls-bar">
        <div className="filters">
          <div className="filter-group">
            <label>Status Filter</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Min Importance ({minImportance})</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={minImportance}
              onChange={(e) => setMinImportance(Number(e.target.value))}
            />
          </div>
        </div>
        
        <button className="btn" onClick={() => setIsFormOpen(true)}>
          <Plus size={20} />
          New Task
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid var(--danger-color)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks found</h2>
          <p>Try adjusting your filters or create a new task.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <TaskForm 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleCreateTask}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}

export default App;
