import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Heart, LayoutDashboard, TriangleAlert, Mic, Activity, Phone, Clock, LogOut,
    CheckCircle2, Battery, Wifi, Navigation, ShieldAlert, MapPin, PhoneCall,
    Mountain, Waves, Wind, Flame, CloudLightning, CloudRain, ThermometerSnowflake,
    Info, CalendarHeart, AlertTriangle, ShieldCheck, ChevronDown, Lock, Droplets
} from 'lucide-react';

const DISASTERS = [
    {
        id: 'flood',
        name: 'Flash Flood',
        icon: Waves,
        iconColor: 'var(--primary-color)',
        riskLevel: 'Level 3 Warning',
        before: ['Build an emergency kit (water, meds, radio).', 'Identify higher ground evacuation routes.', 'Move essential items to upper floors.'],
        during: ['Do NOT walk or drive through flood waters.', 'Move immediately to higher ground.', 'Disconnect electrical appliances.'],
        after: ['Wait for authorities to declare safe.', 'Avoid floodwaters (disease risk).', 'Photograph property damage.']
    },
    {
        id: 'earthquake',
        name: 'Earthquake',
        icon: Mountain,
        iconColor: 'var(--warning-color)',
        riskLevel: 'Magnitude 5.2 Detected',
        before: ['Secure heavy furniture to walls.', 'Identify safe spots (under sturdy tables).', 'Practice Drop, Cover, and Hold On.'],
        during: ['DROP to the ground, COVER your head, HOLD ON.', 'Stay away from windows and glass.', 'If outdoors, move away from buildings.'],
        after: ['Expect aftershocks.', 'Check for gas leaks or electrical damage.', 'Use stairs, not elevators.']
    },
    {
        id: 'cyclone',
        name: 'Cyclone',
        icon: Wind,
        iconColor: 'var(--purple-color)',
        riskLevel: 'Category 2 Approaching',
        before: ['Board up windows and secure loose objects.', 'Stockpile non-perishable food and water.', 'Have backup power ready.'],
        during: ['Stay indoors, away from windows.', 'Take refuge in a small interior room.', 'Beware the calm eye of the storm.'],
        after: ['Stay away from downed power lines.', 'Do not return home until officials say safe.', 'Drink only bottled or boiled water.']
    },
    {
        id: 'fire',
        name: 'Wildfire',
        icon: Flame,
        iconColor: 'var(--danger-color)',
        riskLevel: 'Red Flag Warning',
        before: ['Create a defensible space (remove dry brush).', 'Prepare a "go bag" with essentials.', 'Plan multiple evacuation routes.'],
        during: ['Evacuate immediately if ordered.', 'If trapped, call 911 and find a room with no windows.', 'Cover airways with wet cloths.'],
        after: ['Do not return until fire officials approve.', 'Check roof and exterior for hidden embers.', 'Be aware of ash pits.']
    },
    {
        id: 'heatwave',
        name: 'Heatwave',
        icon: Flame, // Using flame for heat
        iconColor: 'var(--danger-hover)',
        riskLevel: 'Extreme Heat Advisory',
        before: ['Install window reflectors and weather-strip doors.', 'Learn to recognize heat illness symptoms.', 'Plan to check on vulnerable neighbors.'],
        during: ['Stay in air-conditioned buildings.', 'Drink plenty of water; avoid caffeine/alcohol.', 'Limit outdoor activities to morning/evening.'],
        after: ['Continue to stay hydrated.', 'Check on family and friends.', 'Ventilate home at night when cooler.']
    }
];

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Global Disaster State
    const [userLocation, setUserLocation] = useState(null);
    const [nearestDisaster, setNearestDisaster] = useState(null);
    const [selectedDisasterId, setSelectedDisasterId] = useState('flood');

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);

                    try {
                        const token = user?.token || localStorage.getItem('token');
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sos/disasters?lat=${latitude}&lng=${longitude}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            const data = await response.json();

                            // Merge the live data (riskLevel, specific event name) with our UI guides (icons, advice)
                            const matchedBaseDisaster = DISASTERS.find(d => d.id === data.id) || DISASTERS[0];

                            const liveDisaster = {
                                ...matchedBaseDisaster,
                                // If OpenWeather detected a real threat, override the mock risk text
                                riskLevel: data.riskLevel?.includes('Live Data') ? `${data.name} - ${data.riskLevel}` : matchedBaseDisaster.riskLevel,
                                temperature: data.temperature,
                                condition: data.condition
                            };

                            setNearestDisaster(liveDisaster);
                            setSelectedDisasterId(liveDisaster.id);
                        } else {
                            throw new Error("Failed fetching live disaster data");
                        }
                    } catch (err) {
                        console.error("Dashboard Live Disaster Error:", err);
                        setNearestDisaster(DISASTERS[0]);
                        setSelectedDisasterId('flood');
                    }
                },
                (error) => {
                    setUserLocation("Location Denied");
                    setNearestDisaster(DISASTERS[0]);
                    setSelectedDisasterId('flood');
                }
            );
        } else {
            setUserLocation("Geo Not Supported");
            setNearestDisaster(DISASTERS[0]);
            setSelectedDisasterId('flood');
        }
    }, [user]);

    const selectedDisaster = DISASTERS.find(d => d.id === selectedDisasterId) || DISASTERS[0];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper components for the structured grids
    const HelplineCard = ({ icon: Icon, number, title, desc, colorClass }) => (
        <div style={{
            background: `var(--${colorClass})`, padding: '1.5rem', borderRadius: '1rem',
            color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', transition: 'transform 0.2s, filter 0.2s', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%', marginBottom: '0.75rem' }}>
                <Icon size={20} color="white" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>{number}</h3>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.9 }}>{desc}</span>
        </div>
    );

    const DisasterCard = ({ icon: Icon, title, risk, colorClass }) => (
        <div style={{
            background: `var(--${colorClass})`, padding: '1rem', borderRadius: '1rem',
            color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <Icon size={24} color="white" style={{ marginBottom: '0.5rem', opacity: 0.9 }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{risk}</span>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', paddingBottom: '3rem' }}>

            {/* Primary Navbar */}
            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem',
                background: 'var(--bg-nav)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-landing)',
                position: 'sticky', top: 0, zIndex: 50, overflowX: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 'max-content', marginRight: '2rem' }}>
                    <img src="/logo.jpg" alt="Sudarshan Logo" style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'contain', boxShadow: '0 0 10px rgba(88,166,255,0.4)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, lineHeight: 1 }}>SUDARSHAN-AI CARE BUDDY</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', minWidth: 'max-content' }}>
                    {[
                        { name: 'Dashboard', icon: LayoutDashboard, color: 'var(--primary-color)', bg: 'rgba(88,166,255,0.1)', path: '/dashboard' },
                        { name: 'SOS Alert', icon: TriangleAlert, color: 'var(--danger-color)', bg: 'transparent', path: '/sos' },
                        { name: 'AI Assistant', icon: Mic, color: 'var(--text-secondary)', bg: 'transparent', path: '/ai-assistant' },
                        { name: 'Scanner', icon: Activity, color: 'var(--text-secondary)', bg: 'transparent', path: '/scanner' },
                        { name: 'Contacts', icon: Phone, color: 'var(--text-secondary)', bg: 'transparent', path: '/contacts' },
                        { name: 'Routines', icon: Clock, color: 'var(--text-secondary)', bg: 'transparent', path: '/routines' }
                    ].map((item, i) => (
                        <button key={i} onClick={() => navigate(item.path)} style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem', background: item.bg, border: 'none',
                            color: item.color, padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem',
                            fontWeight: item.bg !== 'transparent' ? 600 : 500, transition: 'all 0.2s'
                        }}>
                            <item.icon size={16} /> {item.name}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 'max-content', marginLeft: '2rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </div>
                    <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border-landing)',
                        color: 'var(--danger-color)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem'
                    }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container" style={{ maxWidth: '1000px', marginTop: '2rem' }}>


                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Welcome back, <span style={{ color: 'var(--purple-color)' }}>{user?.name?.split(' ')[0] || 'Rahul'}!</span> 👋</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>Your emergency care dashboard is ready and operational.</p>
                </div>

                {/* Status Bar */}
                <div style={{ background: 'var(--bg-card-dark)', border: '1px solid var(--border-landing)', borderRadius: '1rem', padding: '1rem 2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><CheckCircle2 size={16} color="var(--success-color)" /> <span style={{ color: 'var(--text-secondary)' }}>All Systems:</span> <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>Operational</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><Battery size={16} color="var(--text-secondary)" /> <span style={{ color: 'var(--text-secondary)' }}>Battery:</span> <span style={{ fontWeight: 600 }}>87%</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><Wifi size={16} color="var(--primary-color)" /> <span style={{ color: 'var(--text-secondary)' }}>Network:</span> <span style={{ fontWeight: 600 }}>Strong</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><Navigation size={16} color="var(--text-secondary)" /> <span style={{ color: 'var(--text-secondary)' }}>GPS:</span> <span style={{ fontWeight: 600 }}>Active</span></div>
                </div>

                {/* Emergency Command Center */}
                <div style={{ background: 'var(--bg-card-dark)', border: '1px solid var(--danger-color)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                    {/* Background glow */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,123,114,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', border: '1px solid rgba(255,123,114,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', border: '1px solid rgba(255,123,114,0.02)', borderRadius: '50%', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                <ShieldAlert size={24} color="var(--danger-color)" />
                                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Emergency Command Center</h2>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Instant help is one button away</p>
                        </div>
                        <span style={{ background: 'rgba(46, 160, 67, 0.15)', color: 'var(--success-color)', border: '1px solid rgba(46, 160, 67, 0.3)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: '6px', height: '6px', background: 'var(--success-color)', borderRadius: '50%' }} /> READY
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '3rem 0', position: 'relative', zIndex: 10 }}>
                        <button onClick={() => navigate('/sos')} style={{
                            width: '160px', height: '160px', borderRadius: '50%', background: 'var(--danger-gradient)',
                            border: '10px solid rgba(255, 123, 114, 0.2)', color: 'white', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 40px rgba(255,123,114,0.4)',
                            transition: 'transform 0.1s', animation: 'pulse-danger 2s infinite'
                        }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <TriangleAlert size={40} style={{ marginBottom: '0.5rem' }} />
                            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '2px', lineHeight: 1 }}>SOS</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, marginTop: '0.25rem', opacity: 0.9 }}>PRESS NOW</span>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 10 }}>
                        <button style={{ flex: 1, background: 'var(--bg-card-light)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(88,166,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card-light)'}>
                            <MapPin size={18} /> Share My Location
                        </button>
                        <button style={{ flex: 1, background: 'var(--bg-card-light)', border: '1px solid var(--success-color)', color: 'var(--success-color)', padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(46,160,67,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card-light)'}>
                            <PhoneCall size={18} /> Call 112 Now
                        </button>
                    </div>

                    <div style={{ background: 'var(--bg-card-light)', border: '1px solid var(--border-landing)', borderRadius: '0.75rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 10 }}>
                        <Info size={14} /> Last system check: {currentTime}. All emergency systems operational. Your emergency contacts will be notified instantly when SOS is triggered.
                    </div>
                </div>

                {/* Emergency Helplines */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <PhoneCall size={20} color="var(--danger-color)" />
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Emergency Helplines</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', margin: 0 }}>Quick dial Indian emergency services.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <HelplineCard icon={ShieldAlert} number="112" title="National Emergency" desc="All emergency services" colorClass="danger-color" />
                        <HelplineCard icon={ShieldCheck} number="100" title="Police" desc="Police control room" colorClass="primary-color" />
                        <HelplineCard icon={Activity} number="102" title="Ambulance" desc="Medical emergencies" colorClass="success-color" />
                        <HelplineCard icon={Flame} number="101" title="Fire Brigade" desc="Fire emergency" colorClass="warning-color" />
                        <HelplineCard icon={Heart} number="1091" title="Women Helpline" desc="Women in distress" colorClass="danger-hover" />
                        <HelplineCard icon={CheckCircle2} number="1098" title="Child Helpline" desc="Child protection" colorClass="purple-color" />
                    </div>
                </div>

                {/* Daily Routines & Wellness Accordion */}
                <div style={{ background: 'var(--bg-card-dark)', border: '1px solid var(--border-landing)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-light)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card-dark)'} onClick={() => navigate('/routines')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(255,123,114,0.15)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                            <CalendarHeart size={20} color="var(--danger-color)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Daily Routines & Wellness</h3>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>7 tasks remaining today</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: 'var(--success-color)', fontWeight: 700, fontSize: '1.1rem' }}>33%</span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Complete</div>
                        </div>
                        <ChevronDown size={20} color="var(--text-secondary)" />
                    </div>
                </div>

                {/* Disaster Management */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <AlertTriangle size={20} color="var(--warning-color)" />
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Active Disasters Near You</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Real-time local threats & emergency preparedness</p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-card-dark)', border: '1px solid var(--danger-color)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--danger-color)' }}></div>

                        {/* Nearest Active Disaster Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-landing)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ background: nearestDisaster ? `var(--bg-card-light)` : 'rgba(255,123,114,0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                                    {nearestDisaster ? React.createElement(nearestDisaster.icon, { size: 28, color: nearestDisaster.iconColor }) : <Activity size={28} color="var(--text-secondary)" />}
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                                        {nearestDisaster ? nearestDisaster.riskLevel : 'Scanning for threats...'}
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                        {nearestDisaster?.temperature !== undefined && nearestDisaster?.temperature !== null && (
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <span style={{ color: 'var(--primary-color)' }}>{nearestDisaster.temperature}°C</span> • <span style={{ textTransform: 'capitalize' }}>{nearestDisaster.condition}</span>
                                            </span>
                                        )}
                                        <span style={{ color: 'var(--danger-color)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <MapPin size={12} /> {userLocation ? `${userLocation} (Nearest Node)` : 'Locating you...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span style={{ background: nearestDisaster ? nearestDisaster.iconColor : 'var(--text-secondary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>
                                {nearestDisaster ? 'ACTIVE WARNING' : 'SCANNING'}
                            </span>
                        </div>

                        {/* Interactive Disaster Selector */}
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'block', fontWeight: 600 }}>Emergency Preparedness Guides:</span>
                            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {DISASTERS.map((disaster) => (
                                    <button
                                        key={disaster.id}
                                        onClick={() => setSelectedDisasterId(disaster.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.6rem 1.2rem', borderRadius: '2rem', cursor: 'pointer',
                                            background: selectedDisasterId === disaster.id ? 'var(--primary-gradient)' : 'var(--bg-card-light)',
                                            color: selectedDisasterId === disaster.id ? 'white' : 'var(--text-secondary)',
                                            border: `1px solid ${selectedDisasterId === disaster.id ? 'transparent' : 'var(--border-landing)'}`,
                                            fontWeight: selectedDisasterId === disaster.id ? '600' : '500',
                                            transition: 'all 0.2s', whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={(e) => { if (selectedDisasterId !== disaster.id) e.currentTarget.style.borderColor = 'var(--text-secondary)' }}
                                        onMouseLeave={(e) => { if (selectedDisasterId !== disaster.id) e.currentTarget.style.borderColor = 'var(--border-landing)' }}
                                    >
                                        {React.createElement(disaster.icon, { size: 16, color: selectedDisasterId === disaster.id ? 'white' : disaster.iconColor })}
                                        {disaster.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Disaster Guide */}
                        <div style={{ background: 'var(--bg-color)', padding: '1.25rem', borderRadius: '0.75rem', border: `1px solid var(--border-landing)`, marginTop: '0.5rem', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.1)' }}>
                            <h5 style={{ margin: '0 0 1rem 0', color: selectedDisaster.iconColor, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={18} /> Survival Guide: {selectedDisaster.name}
                            </h5>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ background: 'var(--bg-card-light)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '3px solid var(--success-color)' }}>
                                    <strong style={{ color: 'var(--success-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                        <CheckCircle2 size={14} /> BEFORE (Preparedness)
                                    </strong>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {selectedDisaster.before.map((step, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>)}
                                    </ul>
                                </div>
                                <div style={{ background: 'var(--bg-card-light)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '3px solid var(--danger-color)' }}>
                                    <strong style={{ color: 'var(--danger-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                        <ShieldAlert size={14} /> DURING (Survival)
                                    </strong>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {selectedDisaster.during.map((step, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>)}
                                    </ul>
                                </div>
                                <div style={{ background: 'var(--bg-card-light)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '3px solid var(--primary-color)' }}>
                                    <strong style={{ color: 'var(--primary-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                        <Activity size={14} /> AFTER (Recovery)
                                    </strong>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {selectedDisaster.after.map((step, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-card-dark)', border: '1px solid var(--primary-color)', borderRadius: '0.5rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <ShieldCheck size={16} color="var(--primary-color)" />
                        <span><span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>NDMA Helpline: 1070 |</span> National Disaster Management Authority provides 24x7 emergency confirmation.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ flex: 1, background: 'var(--bg-card-dark)', border: '1px solid var(--border-landing)', borderRadius: '0.75rem', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 600 }}>
                                <CheckCircle2 size={14} /> Emergency Kit Ready?
                            </div>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Keep water, food, first-aid, flashlight, radio & documents.</p>
                        </div>
                        <div style={{ flex: 1, background: 'var(--bg-card-dark)', border: '1px solid var(--border-landing)', borderRadius: '0.75rem', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600 }}>
                                <Info size={14} /> Know Your Evacuation Route
                            </div>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Identify safe zones and evacuation centers near you.</p>
                        </div>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer style={{ padding: '2rem 1rem 1rem', textAlign: 'center', borderTop: '1px solid var(--border-landing)', marginTop: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0.5rem' }}>
                    <Lock size={12} style={{ marginTop: '0.2rem', color: 'var(--warning-color)' }} />
                    <span>This tool provides guidance only. Always call emergency services (112) for immediate life-threatening situations. SUDARSHAN-AI CARE BUDDY is not a substitute for professional medical advice.</span>
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
