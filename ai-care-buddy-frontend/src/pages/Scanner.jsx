import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileText } from 'lucide-react';

const Scanner = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setAnalyzing(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/scan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            setResult(data.analysis);
        } catch (err) {
            setResult("Error uploading or processing the scan.");
        }
        setAnalyzing(false);
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0', marginBottom: '1rem' }} onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="card animate-slide-up">
                <h2 className="text-gradient">Medical Report Scanner</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Upload your MRI or X-Ray report. AI will analyze the image and generate an understandable summary.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <label
                            style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '3rem',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'var(--transition-fast)'
                            }}
                            className="upload-box"
                        >
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            {preview ? (
                                <img src={preview} alt="Upload preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: 'var(--radius-md)' }} />
                            ) : (
                                <>
                                    <UploadCloud size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: '500' }}>Click to select a medical image</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>JPEG, PNG, WebP</p>
                                </>
                            )}
                        </label>

                        {file && (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1.5rem' }}
                                onClick={handleUpload}
                                disabled={analyzing}
                            >
                                {analyzing ? 'Analyzing Report...' : 'Analyze Report Now'}
                            </button>
                        )}
                    </div>

                    {result && (
                        <div style={{ flex: 1, padding: '1.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <FileText size={24} color="var(--primary-color)" />
                                <h3 style={{ margin: 0 }}>AI Insight Summary</h3>
                            </div>
                            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                                {result}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Scanner;
