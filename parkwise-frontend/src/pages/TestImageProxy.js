import React, { useState } from 'react';
import Header from '../components/Header';

function TestImageProxy() {
  const [inputUrl, setInputUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl) {
      setError('Please enter an image URL.');
      return;
    }
    setError('');
    setImageUrl(`${BACKEND_URL}/parking-spots/image?url=${encodeURIComponent(inputUrl)}`);
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h2>Test Image Proxy API</h2>
        <form onSubmit={handleSubmit} className="mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Paste image URL here..."
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Show Image</button>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        {imageUrl && (
          <div style={{ marginTop: 24 }}>
            <img src={imageUrl} alt="Proxied" style={{ maxWidth: '100%', borderRadius: 6, border: '1px solid #ccc' }} onError={() => setError('Failed to load image.')} />
          </div>
        )}
      </div>
    </>
  );
}

export default TestImageProxy; 