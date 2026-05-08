import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-2 mb-md-0">
          <span className="fw-bold">ParkWise</span> &copy; {new Date().getFullYear()} All rights reserved.
        </div>
        <div>
          <span className="text-light me-3 text-decoration-none" style={{ cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>
          <span className="text-light me-3 text-decoration-none" style={{ cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span>
          <span className="text-light text-decoration-none" style={{ cursor: 'pointer', textDecoration: 'underline' }}>Contact</span>
        </div>
      </div>
    </footer>
  );
} 