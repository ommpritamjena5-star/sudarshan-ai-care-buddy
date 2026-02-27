import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Trash2, Phone, Mail, User as UserIcon } from 'lucide-react';

const ContactsManager = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setContacts(data.emergencyContacts || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line
    }, []);

    const addContact = async (e) => {
        e.preventDefault();
        if (!name || !phone) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, phone, email })
            });
            if (res.ok) {
                const updatedContacts = await res.json();
                setContacts(updatedContacts);
                setName('');
                setPhone('');
                setEmail('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteContact = async (contactId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/contacts/${contactId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const updatedContacts = await res.json();
                setContacts(updatedContacts);
            }
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
                <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Users /> Emergency Contacts
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Manage the contacts who will be notified when you trigger an SOS.
                </p>

                <form onSubmit={addContact} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label className="form-label">Contact Name *</label>
                        <input type="text" className="form-input" placeholder="e.g. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <label className="form-label">Phone Number *</label>
                        <input type="tel" className="form-input" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <label className="form-label">Email Address (Optional)</label>
                        <input type="email" className="form-input" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button type="submit" className="btn btn-primary">
                            <Plus size={18} /> Add Contact
                        </button>
                    </div>
                </form>

                <h3 style={{ marginBottom: '1.5rem' }}>Your Contacts</h3>
                {loading ? (
                    <p>Loading contacts...</p>
                ) : contacts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                        <Users size={40} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>You don't have any emergency contacts yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {contacts.map((contact) => (
                            <div
                                key={contact._id}
                                style={{
                                    padding: '1.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)', position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                                        <UserIcon size={20} color="white" />
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{contact.name}</h4>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {contact.phone}</div>
                                    {contact.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {contact.email}</div>}
                                </div>

                                <button
                                    onClick={() => deleteContact(contact._id)}
                                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger-color)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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

export default ContactsManager;
