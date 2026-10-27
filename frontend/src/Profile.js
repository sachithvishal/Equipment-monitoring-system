import React from 'react';

function Profile() {
  const cardStyle = {
    backgroundColor: '#1f2937', 
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #374151'
  };

  return (
    <div className="animate-fade-in" style={{ fontFamily: 'system-ui, sans-serif', color: '#ffffff' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>My Profile</h1>
      <p style={{ color: '#9ca3af', marginBottom: '30px', fontSize: '15px' }}>
        Manage your engineer details and system access.
      </p>

      <div style={{ ...cardStyle, borderTop: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: '#4ade80', 
          color: '#000000',
          width: '80px',
          height: '80px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          VS
        </div>
        <div>
          <div style={{
            backgroundColor: '#374151',
            padding: '4px 10px',
            borderRadius: '999px',
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            color: '#ffffff'
          }}>
            LEAD ENGINEER
          </div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Vishal S S</h2>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>@vishal_ss</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={cardStyle}>
          <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '13px' }}>Staff Number</p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>EG/2023/5937</p>
        </div>
        <div style={cardStyle}>
          <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '13px' }}>System Access Level</p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Full Administrative Status</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;