import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert, MapPin, Mic, Heart, Phone, FileText,
    Sparkles, Shield, Zap, Brain, ArrowRight, ArrowDown,
    TriangleAlert, Route, Lock, HeartPulse, Sun, Moon
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="animated-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--text-primary)', overflowX: 'hidden' }}>

            {/* Navbar */}
            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.25rem 2rem', position: 'sticky', top: 0, zIndex: 100,
                background: 'var(--bg-nav)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border-landing)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.jpg" alt="Sudarshan Logo" style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'contain', boxShadow: '0 0 10px rgba(88,166,255,0.4)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, lineHeight: 1 }}>SUDARSHAN-AI CARE BUDDY</h2>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>AI POWERED EMERGENCY CARE</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                            cursor: 'pointer', display: 'flex', margin: '0 0.5rem'
                        }}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        style={{
                            background: 'transparent', border: '1px solid var(--border-landing)',
                            color: 'var(--text-primary)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)',
                            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s'
                        }}
                        onClick={() => navigate('/login')}
                        onMouseEnter={(e) => e.target.style.background = 'var(--btn-ghost-hover)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        Login
                    </button>
                    <button
                        className="btn-primary"
                        style={{
                            padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)',
                            border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                        onClick={() => navigate('/register')}
                    >
                        Get Started <Sparkles size={14} />
                    </button>
                </div>
            </nav>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* HERO SECTION */}
                <section style={{
                    width: '100%', padding: '5rem 2rem 4rem', textAlign: 'center',
                    background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(88, 166, 255, 0.15), transparent)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>

                    <div className="animate-slide-up" style={{
                        background: 'rgba(88, 166, 255, 0.1)', border: '1px solid rgba(88, 166, 255, 0.2)',
                        padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', color: 'var(--primary-color)',
                        fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        marginBottom: '2rem'
                    }}>
                        <Sparkles size={14} /> Powered by Advanced AI Technology <Sparkles size={14} />
                    </div>

                    <h1 className="animate-slide-up" style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1,
                        letterSpacing: '-0.03em', marginBottom: '1.5rem', animationDelay: '0.1s', color: 'var(--text-primary)'
                    }}>
                        Your Trusted <span style={{ color: 'var(--primary-color)', textShadow: 'var(--shadow-glow)' }}>AI Guardian</span><br />
                        <span style={{ position: 'relative', display: 'inline-block' }}>
                            For Every Emergency
                            <div style={{
                                position: 'absolute', bottom: '-4px', left: 0, width: '100%', height: '4px',
                                background: 'var(--danger-color)', borderRadius: '2px', opacity: 0.8
                            }} />
                        </span><br />
                        Moment <HeartPulse size={36} color="var(--danger-color)" fill="var(--danger-color)" style={{ verticalAlign: 'middle', filter: 'drop-shadow(var(--shadow-glow-danger))' }} />
                    </h1>

                    <p className="animate-slide-up" style={{
                        fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px',
                        margin: '0 auto 2.5rem', lineHeight: 1.6, animationDelay: '0.2s'
                    }}>
                        Get instant disaster guidance, AI voice assistance, medical scan analysis, and one-tap SOS alerts with live location sharing.
                    </p>

                    <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem', animationDelay: '0.3s' }}>
                        <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }} onClick={() => navigate('/register')}>
                            <Shield size={18} /> Start Protecting Yourself <Sparkles size={16} />
                        </button>
                        <button style={{
                            background: 'var(--btn-ghost-bg)', border: '1px solid var(--border-landing)',
                            color: 'var(--text-primary)', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-full)',
                            cursor: 'pointer', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                            transition: 'background 0.2s'
                        }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--btn-ghost-hover)'}
                            onMouseLeave={(e) => e.target.style.background = 'var(--btn-ghost-bg)'}
                        >
                            Explore Features <ArrowDown size={18} />
                        </button>
                    </div>
                    {/* Stats Row */}
                    <div className="animate-slide-up" style={{
                        display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.4s'
                    }}>
                        {[
                            { icon: Shield, color: 'var(--danger-color)', val: '24/7', sub: 'Emergency Ready' },
                            { icon: Zap, color: 'var(--warning-color)', val: '< 3s', sub: 'Response Time' },
                            { icon: Brain, color: 'var(--primary-color)', val: 'AI', sub: 'Powered Analysis' }
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)',
                                padding: '1.5rem 2.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', minWidth: '180px'
                            }}>
                                <stat.icon size={24} color={stat.color} style={{ marginBottom: '0.5rem' }} />
                                <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>{stat.val}</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.sub}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PRIMARY FEATURES */}
                <section className="container" style={{ padding: '2rem 1rem 4rem', width: '100%', maxWidth: '1100px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                        {[
                            {
                                icon: ShieldAlert, iconColor: 'var(--danger-color)', iconBg: 'rgba(255, 123, 114, 0.15)', iconBorder: 'rgba(255, 123, 114, 0.3)', glow: 'rgba(255, 123, 114, 0.2)',
                                title: 'Instant SOS Alert', desc: 'One tap to notify emergency contacts, nearby hospitals, and police with your live location during disasters.'
                            },
                            {
                                icon: MapPin, iconColor: 'var(--success-color)', iconBg: 'rgba(46, 160, 67, 0.15)', iconBorder: 'rgba(46, 160, 67, 0.3)', glow: 'rgba(46, 160, 67, 0.2)',
                                title: 'Live Location Mapping', desc: 'Interactive maps showing nearby hospitals, police stations, and pharmacies with distances and quick directions.'
                            },
                            {
                                icon: Mic, iconColor: 'var(--primary-color)', iconBg: 'rgba(88, 166, 255, 0.15)', iconBorder: 'rgba(88, 166, 255, 0.3)', glow: 'rgba(88, 166, 255, 0.2)',
                                title: 'AI Voice & Scan Analysis', desc: 'Get instant medical guidance through voice AI and analyze MRI/X-Ray scans with advanced AI vision technology.'
                            }
                        ].map((feat, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-card-dark)', border: '1px solid var(--border-landing)', borderRadius: '1.5rem',
                                padding: '2rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default'
                            }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 30px ${feat.glow}`; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div style={{
                                    background: feat.iconBg, display: 'inline-flex', padding: '1rem',
                                    borderRadius: '1rem', marginBottom: '1.5rem', border: `1px solid ${feat.iconBorder}`
                                }}>
                                    <feat.icon size={28} color={feat.iconColor} />
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{feat.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem', minHeight: '70px' }}>
                                    {feat.desc}
                                </p>
                                <div style={{ color: feat.iconColor, fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    Explore <ArrowRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SECONDARY FEATURES ROW */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: Heart, color: 'var(--danger-color)', bg: 'rgba(255, 123, 114, 0.15)', title: 'Daily Health Routines 💊', desc: 'Manage medications, vitals, and wellness tasks with smart reminders.' },
                            { icon: Phone, color: 'var(--warning-color)', bg: 'rgba(210, 153, 34, 0.15)', title: 'Emergency Contacts 📞', desc: 'Store and manage trusted contacts who\'ll be notified during emergencies.' },
                            { icon: FileText, color: 'var(--purple-color)', bg: 'rgba(188, 140, 255, 0.15)', title: 'Medical Records 🔬', desc: 'Upload and analyze medical images with AI-powered insights.' }
                        ].map((feat, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)', borderRadius: '1rem',
                                padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start'
                            }}>
                                <div style={{ background: feat.bg, padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <feat.icon size={20} color={feat.color} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{feat.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* NDMA DISASTER SECTION */}
                <section style={{ width: '100%', padding: '4rem 1rem 6rem', background: 'var(--bg-section)', borderTop: '1px solid var(--border-landing)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <div style={{
                        background: 'rgba(210, 153, 34, 0.1)', border: '1px solid rgba(210, 153, 34, 0.3)',
                        padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', color: 'var(--warning-color)',
                        fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <TriangleAlert size={14} /> India-Specific Disaster Preparedness
                    </div>

                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', background: 'var(--danger-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Disaster Management System
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '700px', marginBottom: '3rem', fontSize: '1rem', lineHeight: 1.5 }}>
                        Comprehensive emergency guides for 8 major disasters common in India, with instant access to NDMA helplines and safety protocols.
                    </p>

                    <div className="container" style={{ maxWidth: '1100px', padding: 0 }}>
                        {/* Main NDMA Card */}
                        <div style={{
                            background: 'var(--bg-card-dark)', border: '1px solid rgba(88, 166, 255, 0.2)', borderRadius: '1.5rem',
                            padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{
                                background: 'var(--primary-gradient)', padding: '1.5rem',
                                borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(88,166,255,0.3)'
                            }}>
                                <ShieldCheck size={36} color="white" />
                            </div>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>National Disaster Management Authority</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>NDMA Helpline: 1070</span> | Available 24x7 for all disaster-related emergencies across India. Get real-time alerts, safety guidelines, and emergency coordination support for Earthquake, Flood, Cyclone, Fire, Landslide, Lightning, Heavy Rain & Extreme Cold.
                                </p>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    <span style={{ background: 'rgba(46, 160, 67, 0.15)', color: 'var(--success-color)', border: '1px solid rgba(46, 160, 67, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>+ 24x7 Support</span>
                                    <span style={{ background: 'rgba(88, 166, 255, 0.15)', color: 'var(--primary-color)', border: '1px solid rgba(88, 166, 255, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>⚡ 8 Disaster Types</span>
                                    <span style={{ background: 'rgba(188, 140, 255, 0.15)', color: 'var(--purple-color)', border: '1px solid rgba(188, 140, 255, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>🛡️ Safety Protocols</span>
                                </div>
                            </div>
                        </div>

                        {/* 3 mini cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { icon: ShieldAlert, color: 'var(--danger-color)', bg: 'rgba(255, 123, 114, 0.15)', title: 'Emergency Kit Ready', desc: 'Keep water, food, first-aid, flash light, radio, important documents, and cash ready at all times.' },
                                { icon: Route, color: 'var(--success-color)', bg: 'rgba(46, 160, 67, 0.15)', title: 'Know Evacuation Routes', desc: 'Identify safe zones, evacuation centers, and emergency shelters in your locality beforehand.' },
                                { icon: Phone, color: 'var(--primary-color)', bg: 'rgba(88, 166, 255, 0.15)', title: 'Save Emergency Numbers', desc: 'Store 112 (National Emergency), 1070 (NDMA), 101 (Fire), 102 (Ambulance), 100 (Police) in speed dial.' }
                            ].map((card, i) => (
                                <div key={i} style={{ background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)', borderRadius: '1rem', padding: '1.5rem' }}>
                                    <div style={{ background: card.bg, display: 'inline-flex', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                                        <card.icon size={20} color={card.color} />
                                    </div>
                                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{card.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer style={{ padding: '2rem 1rem 3rem', textAlign: 'center', background: 'transparent', borderTop: '1px solid var(--border-landing)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    background: 'rgba(46, 160, 67, 0.1)', border: '1px solid rgba(46, 160, 67, 0.2)',
                    padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', color: 'var(--success-color)',
                    fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '1.5rem'
                }}>
                    <Lock size={14} /> Your privacy and security are our top priority <Sparkles size={14} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '600px', margin: 0, lineHeight: 1.5 }}>
                    This tool provides guidance only. Always call emergency services (112) for immediate life-threatening situations. SUDARSHAN-AI CARE BUDDY is not a substitute for professional medical advice.
                </p>
            </footer>
        </div>
    );
};

// Quick stub missing icon fix for "ShieldCheck" which lucide-react provides.
const ShieldCheck = ({ size, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export default Landing;
