import React from 'react';

function Profile() {
  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2>My Profile</h2>
      <p style={{ color: '#aaa', marginBottom: '20px' }}>Manage your technician details and system access.</p>
      
      {/* Profile Banner */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        borderTop: '4px solid #4CAF50', 
        padding: '24px', 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        <div style={{ 
          width: '70px', height: '70px', 
          backgroundColor: '#4CAF50', color: '#000', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          borderRadius: '12px', fontSize: '24px', fontWeight: 'bold' 
        }}>
          VS
        </div>
        <div>
          <span style={{ backgroundColor: '#333', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            LEAD TECHNICIAN
          </span>
          <h3 style={{ margin: '10px 0 5px 0', fontSize: '22px' }}>Vishal S S</h3>
          <p style={{ margin: 0, color: '#aaa' }}>@vishal_ss</p>
        </div>
      </div>

      {/* Account Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>University Registration</p>
          <p style={{ margin: '8px 0 0 0', fontWeight: 'bold' }}>EG/2023/5937</p>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>System Access Level</p>
          <p style={{ margin: '8px 0 0 0', fontWeight: 'bold' }}>Full Administrative Status</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;