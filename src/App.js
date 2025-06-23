import React, { useState, useEffect, useCallback } from 'react';

import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaCheck, FaSun, FaMoon, FaEdit, FaBroom } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Confetti from 'react-confetti';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (!task.trim()) return;
    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex].text = task;
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, { text: task, completed: false }]);
    }
    setTask('');
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    if (updated.length === 0) setShowConfetti(true);
  };

  const editTask = (index) => {
    setTask(tasks[index].text);
    setEditingIndex(index);
  };

  const clearAll = () => {
    setTasks([]);
    setShowConfetti(true);
  };

  const filtered = tasks.filter(t =>
    filter === 'completed' ? t.completed :
    filter === 'active' ? !t.completed : true
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const particlesInit = useCallback(async (engine) => {
  await loadFull(engine);
}, []);


  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
     {process.env.NODE_ENV !== 'test' && (
  <Particles
    id="tsparticles"
    init={particlesInit}
    options={{
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        color: { value: '#ffffff' },
        move: { enable: true, speed: 1 },
        number: { value: 50 },
        size: { value: 2 },
      }
    }}
  />
)}


      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="header">
        <h1>🌟 Personal To-Do App</h1>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="input-group">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="What's next?"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1, backgroundColor: "#8b5cf6" }}
          transition={{ duration: 0.2 }}
          onClick={addTask}
        >
          {editingIndex !== null ? 'Update' : 'Add'}
        </motion.button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        {tasks.length > 0 && (
          <motion.button
            className="clear-btn"
            onClick={clearAll}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <FaBroom style={{ marginRight: 5 }} />
            Clear All
          </motion.button>
        )}
      </div>

      <ul>
        <AnimatePresence>
          {filtered.map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              layout
              transition={{ duration: 0.4 }}
            >
              <span
                className={t.completed ? 'done' : ''}
                onClick={() => toggleComplete(i)}
              >
                {t.text}
              </span>
              <div className="icons">
                <FaCheck onClick={() => toggleComplete(i)} className="icon check" />
                <FaEdit onClick={() => editTask(i)} className="icon" />
                <FaTrash onClick={() => deleteTask(i)} className="icon delete" />
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {tasks.length === 0 && (
        <motion.p
          className="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          🎉 Start by adding your first task!
        </motion.p>
      )}
    </div>
  );
}

export default App;
