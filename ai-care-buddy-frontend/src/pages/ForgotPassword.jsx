import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerifyClick = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, mobile })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('');
                setStep(2); // Move to set password step
            } else {
                setError(data.message || 'Error verifying account.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetClick = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('Password has been reset successfully.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message || 'Error resetting password.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Header matches Login exactly */}
            <header className="auth-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.jpg" alt="Sudarshan Logo" style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'contain', boxShadow: '0 0 10px rgba(88,166,255,0.4)' }} />
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>SUDARSHAN-AI CARE BUDDY</h2>
                </div>
            </header>

            <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Reset Password</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {step === 1 ? 'Enter your email and phone number to verify' : 'Set your new password'}
                    </p>
                </div>

                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1.5rem', textAlign: 'center', padding: '0.75rem', background: 'rgba(255, 123, 114, 0.1)', border: '1px solid rgba(255,123,114,0.2)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
                {status && <div style={{ color: 'var(--success-color)', marginBottom: '1.5rem', textAlign: 'center', padding: '0.75rem', background: 'rgba(46, 160, 67, 0.1)', border: '1px solid rgba(46,160,67,0.2)', borderRadius: 'var(--radius-sm)' }}>{status}</div>}

                {step === 1 ? (
                    <form onSubmit={handleVerifyClick}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                            <div className="input-icon-wrapper">
                                <span className="icon-left" style={{ opacity: 0.6 }}><Mail size={18} /></span>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ background: 'var(--bg-color)', border: '1px solid var(--border-landing)' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Phone Number</label>
                            <div className="input-icon-wrapper">
                                <span className="icon-left" style={{ opacity: 0.6, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>+91 <span style={{ padding: '0 0.25rem', opacity: 0.3 }}>|</span></span>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="98765 43210"
                                    style={{ paddingLeft: '4rem', background: 'var(--bg-color)', border: '1px solid var(--border-landing)' }}
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2rem', marginTop: '0.25rem' }}>
                            Enter your registered mobile number
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Account'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetClick}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>New Password</label>
                            <div className="input-icon-wrapper">
                                <span className="icon-left" style={{ opacity: 0.6 }}><Lock size={18} /></span>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    style={{ background: 'var(--bg-color)', border: '1px solid var(--border-landing)' }}
                                />
                                <span className="icon-right" style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label" style={{ fontSize: '0.85rem' }}>Confirm Password</label>
                            <div className="input-icon-wrapper">
                                <span className="icon-left" style={{ opacity: 0.6 }}><Lock size={18} /></span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ background: 'var(--bg-color)', border: '1px solid var(--border-landing)' }}
                                />
                                <span className="icon-right" style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }} disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
