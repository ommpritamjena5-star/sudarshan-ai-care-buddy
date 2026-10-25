import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Droplet, Phone, AlertCircle } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Emergency Contact State
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [emergencyEmail, setEmergencyEmail] = useState('');
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Passing all parameters to the AuthContext including new form fields
        const success = await register(name, email, password, mobile, bloodGroup, emergencyName, emergencyPhone, emergencyEmail);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Registration failed. Try again.');
        }
    };

    return (
        <div className="auth-container">
            {/* Header */}
            <header className="auth-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.jpg" alt="Sudarshan Logo" style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'contain', boxShadow: '0 0 10px rgba(88,166,255,0.4)' }} />
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>SUDARSHAN-AI CARE BUDDY</h2>
                </div>
                <Link to="/" className="auth-back">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </header>

            <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Create Your Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Join SUDARSHAN-AI CARE BUDDY for emergency protection</p>

                    {/* Pills */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <span style={{
                            background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)', color: 'var(--text-secondary)',
                            padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 500
                        }}>
                            Serving India
                        </span>
                        <span style={{
                            background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)', color: 'var(--text-secondary)',
                            padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 500,
                            display: 'flex', alignItems: 'center', gap: '0.25rem'
                        }}>
                            🚑 Ayushman Ready
                        </span>
                    </div>
                </div>

                {/* Google Button */}
                <button type="button" className="google-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Quick Register with Google
                </button>

                <div className="auth-divider">Or register with details</div>

                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div className="input-icon-wrapper">
                            <span className="icon-left"><User size={18} /></span>
                            <input
                                type="text"
                                placeholder="Rahul Sharma"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Mobile Number</label>
                            <div className="input-icon-wrapper">
                                <span className="input-prefix">+91</span>
                                <input
                                    type="tel"
                                    placeholder="98765 43210"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Blood Group</label>
                            <div className="input-icon-wrapper">
                                <span className="icon-left"><Droplet size={18} /></span>
                                <input
                                    type="text"
                                    placeholder="O+"
                                    value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-icon-wrapper">
                            <span className="icon-left"><Mail size={18} /></span>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Password</label>
                        <div className="input-icon-wrapper">
                            <span className="icon-left"><Lock size={18} /></span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="icon-right" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Emergency Contact (Recommended)</span>
                        <span style={{
                            background: 'rgba(255, 123, 114, 0.1)', color: 'var(--danger-color)',
                            padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 600
                        }}>Critical</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Name</label>
                        <div className="input-icon-wrapper">
                            <span className="icon-left"><User size={18} /></span>
                            <input
                                type="text"
                                placeholder="Priya Sharma"
                                value={emergencyName}
                                onChange={(e) => setEmergencyName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Phone</label>
                        <div className="input-icon-wrapper">
                            <span className="input-prefix">+91</span>
                            <input
                                type="tel"
                                placeholder="98765 43210"
                                value={emergencyPhone}
                                onChange={(e) => setEmergencyPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Email</label>
                        <div className="input-icon-wrapper">
                            <span className="icon-left"><Mail size={18} /></span>
                            <input
                                type="email"
                                placeholder="emergency@example.com"
                                value={emergencyEmail}
                                onChange={(e) => setEmergencyEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)',
                        padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', gap: '0.5rem' }}>
                            <span>By creating an account, you agree to our Terms of Service and Privacy Policy. Your data is secured with bank-grade encryption. <Lock size={12} style={{ display: 'inline' }} /></span>
                        </p>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
                        Create Account
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
