import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Loader2, Volume2, Send } from 'lucide-react';

const AIAssistant = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [listening, setListening] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [userCommand, setUserCommand] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [textInput, setTextInput] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [userCommand, aiResponse, processing]);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any current speech
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = async (command) => {
        setUserCommand(command);
        setProcessing(true);
        setAiResponse('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/voice-command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ command })
            });
            const data = await res.json();
            setAiResponse(data.response);
            speakText(data.response);
        } catch (err) {
            setAiResponse("I couldn't process your request.");
        }
        setProcessing(false);
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (!textInput.trim() || processing) return;
        const command = textInput.trim();
        setTextInput('');
        processCommand(command);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Your browser doesn't support speech recognition.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setListening(true);
            setUserCommand('');
            setAiResponse('');
        };

        recognition.onresult = async (event) => {
            const command = event.results[0][0].transcript;
            setListening(false);
            processCommand(command);
        };

        recognition.onerror = () => {
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0', marginBottom: '1rem', flexShrink: 0, alignSelf: 'flex-start' }} onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="card animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.5rem 1.5rem 0 1.5rem' }}>
                <div style={{ flexShrink: 0 }}>
                    <h2 className="text-gradient">AI Guidance</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Type or speak to your SUDARSHAN-AI CARE BUDDY for disaster guidance or health advice.
                    </p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingBottom: '2rem' }}>
                    {userCommand && (
                        <div style={{ alignSelf: 'flex-end', background: 'var(--primary-gradient)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', maxWidth: '85%', boxShadow: '0 4px 12px rgba(88,166,255,0.2)' }}>
                            <p style={{ color: 'white', fontWeight: '500', margin: 0 }}>{userCommand}</p>
                        </div>
                    )}

                    {processing && (
                        <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-color-elevated)', padding: '0.75rem 1.25rem', borderRadius: '2rem' }}>
                            <Loader2 className="animate-spin" size={18} /> <span style={{ fontSize: '0.9rem' }}>AI is thinking...</span>
                        </div>
                    )}

                    {aiResponse && (
                        <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card-dark)', border: '1px solid var(--border-color)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{ background: 'var(--primary-gradient)', padding: '0.4rem', borderRadius: '50%' }}>
                                        <Mic size={14} color="white" />
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Care Buddy</span>
                                </div>
                                <button
                                    onClick={() => speakText(aiResponse)}
                                    title="Listen"
                                    style={{ background: 'rgba(88,166,255,0.1)', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(88,166,255,0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(88,166,255,0.1)'}
                                >
                                    <Volume2 size={16} />
                                </button>
                            </div>
                            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{aiResponse}</p>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', background: 'var(--bg-card-light)', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
                    <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Type your message here..."
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '2rem',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-color)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!textInput.trim() || processing}
                            style={{
                                background: textInput.trim() && !processing ? 'var(--primary-gradient)' : 'var(--bg-color-elevated)',
                                color: textInput.trim() && !processing ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: textInput.trim() && !processing ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Send size={20} style={{ marginLeft: '2px' }} />
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Or use voice</span>
                        <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={listening ? () => { } : startListening}
                            disabled={processing}
                            title={listening ? "Listening..." : "Tap to speak"}
                            style={{
                                width: '64px', height: '64px', borderRadius: '50%', padding: 0, border: 'none',
                                animation: listening ? 'pulse-danger 1.5s infinite' : 'none',
                                background: listening ? 'var(--danger-color)' : processing ? 'var(--bg-color-elevated)' : 'var(--bg-card-dark)',
                                color: listening ? 'white' : processing ? 'var(--text-secondary)' : 'var(--primary-color)',
                                border: listening ? 'none' : processing ? 'none' : '1px solid var(--primary-color)',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', boxShadow: listening ? '0 0 20px rgba(255,123,114,0.4)' : 'none'
                            }}
                            onMouseEnter={(e) => { if (!listening && !processing) e.currentTarget.style.background = 'var(--bg-color-elevated)'; }}
                            onMouseLeave={(e) => { if (!listening && !processing) e.currentTarget.style.background = 'var(--bg-card-dark)'; }}
                        >
                            {listening ? <Loader2 className="animate-spin" size={28} /> : <Mic size={28} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
