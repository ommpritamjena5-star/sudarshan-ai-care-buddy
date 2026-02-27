import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Plus, Trash2, CheckCircle } from 'lucide-react';

const Routines = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [routines, setRoutines] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchRoutines = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/routines`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setRoutines(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRoutines();
        // eslint-disable-next-line
    }, []);

    const addRoutine = async (e) => {
        e.preventDefault();
        if (!newTitle || !newTime) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/routines`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: newTitle, time: newTime })
            });
            const added = await res.json();
            setRoutines([...routines, added]);
            setNewTitle('');
            setNewTime('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComplete = async (id, isCompleted) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/routines/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCompleted: !isCompleted })
            });
            if (res.ok) fetchRoutines();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteRoutine = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/routines/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchRoutines();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0', marginBottom: '1rem' }} onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="card animate-slide-up">
                <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock /> Daily Routines
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Manage your daily routines, medications, and physical activities. (Email reminders are handled by the backend automatically.)
                </p>

                <form onSubmit={addRoutine} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="E.g., Take Blood Pressure Medication"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        style={{ flex: '1 1 200px' }}
                    />
                    <input
                        type="time"
                        className="form-input"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        style={{ flex: '0 0 150px' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
                        <Plus size={18} /> Add
                    </button>
                </form>

                {loading ? (
                    <p>Loading routines...</p>
                ) : routines.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No routines added yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {routines.map((routine) => (
                            <div
                                key={routine._id}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '1.25rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)',
                                    border: `1px solid ${routine.isCompleted ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                    transition: 'var(--transition-fast)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        onClick={() => toggleComplete(routine._id, routine.isCompleted)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: routine.isCompleted ? 'var(--primary-color)' : 'var(--text-secondary)' }}
                                    >
                                        <CheckCircle size={24} />
                                    </button>
                                    <div>
                                        <h4 style={{ margin: 0, textDecoration: routine.isCompleted ? 'line-through' : 'none', color: routine.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                            {routine.title}
                                        </h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{routine.time}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteRoutine(routine._id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Routines;
