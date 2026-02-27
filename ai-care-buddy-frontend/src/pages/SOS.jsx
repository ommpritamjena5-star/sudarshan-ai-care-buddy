import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Shield, Activity, PhoneCall, ExternalLink } from 'lucide-react';

const SOS = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Idle');
    const [location, setLocation] = useState(null);

    const [nearby, setNearby] = useState({ hospitals: [], police: [], medical: [] });
    const [activeTab, setActiveTab] = useState('hospitals');
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [loadingNearby, setLoadingNearby] = useState(false);

    // 1. Fetch Location on Mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            }, (err) => {
                console.error("Geo err:", err);
            });
        }
    }, []);

    // 2. Fetch Nearby Places automatically once location is secured
    useEffect(() => {
        const fetchNearby = async () => {
            if (!location) return;
            setLoadingNearby(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sos/nearby?lat=${location.lat}&lng=${location.lng}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setNearby(data);
                }
            } catch (err) {
                console.error("Failed to fetch nearby places", err);
            } finally {
                setLoadingNearby(false);
            }
        };

        fetchNearby();
    }, [location, token]);

    const triggerSOS = async () => {
        if (!location) {
            alert('Please wait for location to sync or turn on GPS.');
            return;
        }

        setStatus('Triggering SOS Alert...');
        try {
            // 1. Send Alert (SMS + Email)
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sos/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(location)
            });
            setStatus('SOS Alert Sent! Police, Hospitals, and Contacts notified.');

            // Note: Nearby is already fetched automatically now.
        } catch (e) {
            setStatus('Error triggering SOS. Try calling 911 immediately.');
        }
    };

    const getActiveList = () => {
        if (activeTab === 'hospitals') return nearby.hospitals;
        if (activeTab === 'police') return nearby.police;
        return nearby.medical;
    };

    const activePlaces = getActiveList();

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0', marginBottom: '1rem' }} onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="card animate-slide-up" style={{ textAlign: 'center', borderColor: 'var(--danger-color)', marginBottom: '2rem' }}>
                <h2 className="text-danger" style={{ marginBottom: '1rem' }}>Emergency Response Hub</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    By pressing the SOS button, we will immediately send your live location, time, and an urgent help message to nearby police stations, hospitals, and your emergency contacts.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button className="btn-sos" onClick={triggerSOS} disabled={status.includes('Triggering')}>
                        SOS
                    </button>
                </div>

                {status !== 'Idle' && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: status.includes('Sent') ? 'rgba(88, 166, 255, 0.1)' : 'rgba(255, 123, 114, 0.1)',
                        border: `1px solid ${status.includes('Sent') ? 'var(--primary-color)' : 'var(--danger-color)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                    }}>
                        {status.includes('Sent') ? <Shield size={24} color="var(--primary-color)" /> : <Activity size={24} color="var(--danger-color)" />}
                        <p style={{ fontWeight: '600', color: status.includes('Sent') ? 'var(--primary-color)' : 'var(--danger-color)', margin: 0 }}>
                            {status}
                        </p>
                    </div>
                )}
            </div>


            {/* Nearby Services Container (Always Rendered to show Tabs & Map Placeholder) */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                {/* Nearby Services List */}
                <div className="card" style={{ flex: '1 1 350px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Nearby Services</h3>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <button
                            onClick={() => { setActiveTab('hospitals'); setSelectedPlace(null); }}
                            style={{
                                background: activeTab === 'hospitals' ? 'var(--bg-color-elevated)' : 'transparent',
                                border: 'none', color: activeTab === 'hospitals' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', flex: 1
                            }}
                        >
                            Hospitals
                        </button>
                        <button
                            onClick={() => { setActiveTab('police'); setSelectedPlace(null); }}
                            style={{
                                background: activeTab === 'police' ? 'var(--bg-color-elevated)' : 'transparent',
                                border: 'none', color: activeTab === 'police' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', flex: 1
                            }}
                        >
                            Police
                        </button>
                        <button
                            onClick={() => { setActiveTab('medical'); setSelectedPlace(null); }}
                            style={{
                                background: activeTab === 'medical' ? 'var(--bg-color-elevated)' : 'transparent',
                                border: 'none', color: activeTab === 'medical' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', flex: 1
                            }}
                        >
                            Pharmacies
                        </button>
                    </div>

                    {/* List */}
                    {loadingNearby ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                            <Activity className="animate-pulse" size={32} style={{ marginBottom: '1rem', margin: '0 auto' }} />
                            <p>Scanning area for emergency facilities...</p>
                        </div>
                    ) : activePlaces.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {activePlaces.map((place, i) => (
                                <li
                                    key={i}
                                    onClick={() => setSelectedPlace(place)}
                                    style={{
                                        padding: '1rem', borderBottom: '1px solid var(--border-color)',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        cursor: 'pointer', background: selectedPlace?.name === place.name ? 'var(--bg-color-elevated)' : 'transparent',
                                        borderRadius: 'var(--radius-sm)', transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {activeTab === 'hospitals' && <Activity size={20} color="var(--primary-color)" />}
                                        {activeTab === 'police' && <Shield size={20} color="var(--primary-color)" />}
                                        {activeTab === 'medical' && <MapPin size={20} color="var(--primary-color)" />}
                                        <span>{place.name}</span>
                                    </div>
                                    <span style={{ color: 'var(--danger-color)', fontWeight: 'bold', fontSize: '0.9rem' }}>{place.distance}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                            <p>No exact locations found in a 5km radius.</p>
                        </div>
                    )}
                </div>

                {/* Interactive Map view */}
                <div className="card" style={{ flex: '1 1 400px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {selectedPlace ? (
                        <>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{selectedPlace.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Distance: {selectedPlace.distance}</p>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                                >
                                    Open in Maps <ExternalLink size={16} />
                                </a>
                            </div>
                            {/* Embed Map iframe */}
                            <iframe
                                title="Live Map"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '400px' }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}&z=15&output=embed`}
                            ></iframe>
                        </>
                    ) : (
                        <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
                            <MapPin size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: 'var(--text-secondary)' }}>Select a location on the left</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>To view directions and live map details.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
export default SOS;
