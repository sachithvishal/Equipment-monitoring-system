import { useState, useEffect } from 'react';
import Profile from './Profile';

function App() {
  const [currentView, setCurrentView] = useState('login');
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [equipmentLogs, setEquipmentLogs] = useState([]);
  const [formData, setFormData] = useState({
    equipmentName: '', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '', notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); 

  useEffect(() => {
    fetch('http://localhost:5000/api/equipment')
      .then(res => res.json())
      .then(data => setEquipmentLogs(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.username.trim() === '' || loginForm.password.trim() === '') {
      setLoginError('Please enter both your username and password.');
      return;
    }
    setLoginError('');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setLoginForm({ username: '', password: '' });
    setCurrentView('login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(newLog => {
        setEquipmentLogs([...equipmentLogs, newLog]);
        setFormData({ equipmentName: '', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '', notes: '' });
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/equipment/${id}`, { method: 'DELETE' })
      .then(() => setEquipmentLogs(equipmentLogs.filter(log => log._id !== id)));
  };

  const handleEditClick = (log) => {
    setEditingId(log._id);
    setEditFormData(log);
  };

  const submitEdit = (id) => {
    fetch(`http://localhost:5000/api/equipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData)
    })
      .then(res => res.json())
      .then(updatedLog => {
        setEquipmentLogs(equipmentLogs.map(log => log._id === id ? updatedLog : log));
        setEditingId(null);
      });
  };

  const seedDatabase = async () => {
    const initialPool = [
      { equipmentName: 'AC Induction Motor 01', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: 'Rated: 11kV, 50Hz, 1500 RPM', notes: 'Main coolant pump motor.' },
      { equipmentName: 'Synchronous Motor 02', status: 'Operational', condition: 'New', technician: 'Unassigned', details: 'Rated: 3.3kV, 0.9 PF', notes: 'Air compressor drive.' },
      { equipmentName: 'Boiler Feed Pump Motor 03', status: 'Needs Maintenance', condition: 'Fair', technician: 'Vishal S S', details: 'Rated: 6.6kV, 2000kW', notes: 'Vibration detected on DE bearing.' },
      { equipmentName: 'CW Pump Motor 04', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: 'Rated: 415V, 3-Phase', notes: 'Cooling water circulation.' },
      { equipmentName: 'ID Fan Motor 05', status: 'Grounded', condition: 'Critical', technician: 'Unassigned', details: 'Rated: 6.6kV, 1200kW', notes: 'Stator winding insulation failure.' },
      
      { equipmentName: 'HP Steam Turbine 01', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: 'High Pressure, 3000 RPM, 540°C', notes: 'Running at base load.' },
      { equipmentName: 'IP Steam Turbine 02', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: 'Intermediate Pressure, 3000 RPM', notes: 'Normal operation.' },
      { equipmentName: 'LP Steam Turbine 03', status: 'Needs Maintenance', condition: 'Fair', technician: 'Vishal S S', details: 'Low Pressure, Double Exhaust', notes: 'Condenser vacuum slightly low.' },
      { equipmentName: 'Gas Turbine 04', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '150 MW, Peak Load Unit', notes: 'Standby mode ready.' },
      { equipmentName: 'Hydro Turbine 05', status: 'Grounded', condition: 'Poor', technician: 'Unassigned', details: 'Kaplan Type, 50 MW', notes: 'Runner blades undergoing cavitation repair.' },
      
      { equipmentName: 'Main LV Switchboard 01', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '415V, 4000A Busbar', notes: 'All incomers active.' },
      { equipmentName: 'HV Switchgear 02', status: 'Operational', condition: 'New', technician: 'Unassigned', details: '11kV, SF6 Gas Insulated', notes: 'Recently commissioned.' },
      { equipmentName: 'Station Transformer 03', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '11kV/415V, 2.5 MVA', notes: 'Oil level normal, temp normal.' },
      { equipmentName: 'Excitation Panel 04', status: 'Needs Maintenance', condition: 'Fair', technician: 'Vishal S S', details: '400V DC Output', notes: 'Thyristor cooling fan erratic.' },
      { equipmentName: 'Battery Bank 05', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '220V DC, 1000 Ah Lead-Acid', notes: 'Float charging normal.' }
    ];

    for (const item of initialPool) {
      await fetch('http://localhost:5000/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    }
    
    const res = await fetch('http://localhost:5000/api/equipment');
    const data = await res.json();
    setEquipmentLogs(data);
  };

  const totalMotors = equipmentLogs.length;
  const operational = equipmentLogs.filter(log => log.status === 'Operational').length;
  const maintenance = equipmentLogs.filter(log => log.status === 'Needs Maintenance').length;
  const grounded = equipmentLogs.filter(log => log.status === 'Grounded').length;

  // Student-style search and sort logic
  let filteredEquipment = equipmentLogs.filter(log => {
    return log.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  filteredEquipment.sort((a, b) => {
    if (sortBy === 'status') {
      if (a.status < b.status) return -1;
      if (a.status > b.status) return 1;
      return 0;
    } else if (sortBy === 'condition') {
      if (a.condition < b.condition) return -1;
      if (a.condition > b.condition) return 1;
      return 0;
    } else {
      if (a.equipmentName < b.equipmentName) return -1;
      if (a.equipmentName > b.equipmentName) return 1;
      return 0;
    }
  });

  const getStatusColor = (status) => {
    if (status === 'Operational') return '#10b981'; 
    if (status === 'Needs Maintenance') return '#f59e0b'; 
    if (status === 'Grounded') return '#ef4444'; 
    return '#6b7280';
  };

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white', boxSizing: 'border-box' };

  const animationStyles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.8s ease-in-out forwards; }
    .btn-hover { transition: all 0.2s ease-in-out; }
    .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-5px); border-color: #10b981 !important; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.1); }
  `;

  if (currentView === 'login') {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <style>{animationStyles}</style>
        <div className="animate-slide-up" style={{ display: 'flex', backgroundColor: '#111827', borderRadius: '16px', overflow: 'hidden', width: '850px', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.5)', minHeight: '450px', border: '1px solid #1f2937' }}>
          <div style={{ flex: 1, backgroundColor: '#10b981', color: '#000000', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '36px', marginBottom: '15px', fontWeight: '900', animationDelay: '0.1s', opacity: 0 }}>Welcome Back!</h1>
            <p className="animate-slide-up" style={{ lineHeight: '1.6', fontWeight: '500', animationDelay: '0.2s', opacity: 0 }}>Your telemetry companion to track operational status, physical conditions, and monitor power plant equipment effortlessly.</p>
          </div>
          <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="animate-slide-up" style={{ color: '#10b981', marginBottom: '25px', textAlign: 'center', animationDelay: '0.1s', opacity: 0 }}>Login to Your Account</h2>
            <form onSubmit={handleLoginSubmit} className="animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              {loginError && <div style={{ backgroundColor: '#ef444420', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', border: '1px solid #ef444450', textAlign: 'center' }}>{loginError}</div>}
              <input type="text" name="username" placeholder="Username or Email" value={loginForm.username} onChange={handleLoginChange} style={{ ...inputStyle, marginBottom: '15px' }} />
              <input type="password" name="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} style={{ ...inputStyle, marginBottom: '25px' }} />
              <button type="submit" className="btn-hover" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Login</button>
            </form>
            <p className="animate-slide-up" style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#9ca3af', animationDelay: '0.3s', opacity: 0 }}>Don't have an account? <span onClick={() => { setLoginError(''); setCurrentView('register'); }} style={{ color: '#10b981', cursor: 'pointer', fontWeight: 'bold' }}>Register now</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <style>{animationStyles}</style>
        <div className="animate-slide-up" style={{ display: 'flex', backgroundColor: '#111827', borderRadius: '16px', overflow: 'hidden', width: '900px', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.5)', minHeight: '500px', border: '1px solid #1f2937' }}>
          <div style={{ flex: 1, backgroundColor: '#10b981', color: '#000000', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '36px', marginBottom: '15px', fontWeight: '900', animationDelay: '0.1s', opacity: 0 }}>Join TelemetryMate</h1>
            <p className="animate-slide-up" style={{ lineHeight: '1.6', fontWeight: '500', animationDelay: '0.2s', opacity: 0 }}>Create an account to securely access the power plant database, assign engineers, and track real-time statistics.</p>
          </div>
          <div style={{ flex: 1.2, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="animate-slide-up" style={{ color: '#10b981', marginBottom: '25px', textAlign: 'center', animationDelay: '0.1s', opacity: 0 }}>Create Your Account</h2>
            <form onSubmit={(e) => { e.preventDefault(); setCurrentView('login'); }} className="animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <input type="text" placeholder="Full Name" required style={inputStyle} />
                <input type="text" placeholder="Username" required style={inputStyle} />
              </div>
              <input type="email" placeholder="Email Address" required style={{ ...inputStyle, marginBottom: '15px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <input type="password" placeholder="Password" required style={inputStyle} />
                <input type="password" placeholder="Confirm Password" required style={inputStyle} />
              </div>
              <button type="submit" className="btn-hover" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Register</button>
            </form>
            <p className="animate-slide-up" style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#9ca3af', animationDelay: '0.3s', opacity: 0 }}>Already have an account? <span onClick={() => setCurrentView('login')} style={{ color: '#10b981', cursor: 'pointer', fontWeight: 'bold' }}>Login here</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#ffffff' }}>
        <style>{animationStyles}</style>
        
        <nav style={{ backgroundColor: '#111827', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937' }}>
          <h2 style={{ margin: 0, color: '#10b981' }}>TelemetryMate</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#d1d5db', fontWeight: '500' }}>Hi, {loginForm.username || 'Vishal S S'}</span>
            <button className="btn-hover" onClick={() => setCurrentView('dashboard')} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Dashboard</button>
            <button className="btn-hover" onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
          <Profile />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#ffffff', paddingBottom: '50px' }}>
      <style>{animationStyles}</style>
      
      <nav style={{ backgroundColor: '#111827', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937' }}>
        <h2 style={{ margin: 0, color: '#10b981' }}>TelemetryMate</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#d1d5db', fontWeight: '500' }}>Hi, {loginForm.username || 'Vishal S S'}</span>
          <button className="btn-hover" onClick={() => setCurrentView('profile')} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Profile</button>
          <button className="btn-hover" onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        
        <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937', animationDelay: '0.1s', opacity: 0 }}>
          <div>
            <h1 style={{ margin: 0, color: '#ffffff' }}>Welcome back, {loginForm.username || 'Vishal S S'}</h1>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Track equipment condition, manage plant modules, and assign technicians.</p>
          </div>
          {equipmentLogs.length === 0 && (
            <button className="btn-hover" onClick={seedDatabase} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              + Inject Initial 15 Power Plant Units
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.2s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Total Facility Units</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{totalMotors}</p>
          </div>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.3s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Fully Operational</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{operational}</p>
          </div>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.4s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Needs Maintenance</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{maintenance}</p>
          </div>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.5s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Currently Grounded</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{grounded}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="animate-slide-up" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937', animationDelay: '0.6s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#ffffff' }}>Add / Import New Unit</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <input type="text" name="equipmentName" placeholder="Unit Name (e.g. Pump 06)" value={formData.equipmentName} onChange={handleChange} required style={inputStyle}/>
              <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                <option value="Operational">Operational</option>
                <option value="Needs Maintenance">Maintenance</option>
                <option value="Grounded">Grounded</option>
                <option value="Offline">Offline</option>
              </select>
              <select name="condition" value={formData.condition} onChange={handleChange} style={inputStyle}>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Critical">Critical</option>
              </select>
              <input type="text" name="technician" placeholder="Assign Technician" value={formData.technician} onChange={handleChange} required style={inputStyle}/>
              <input type="text" name="details" placeholder="Rated Voltage / Details" value={formData.details} onChange={handleChange} style={inputStyle}/>
              <input type="text" name="notes" placeholder="Current Session Notes" value={formData.notes} onChange={handleChange} style={inputStyle}/>
              <button className="btn-hover" type="submit" style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Register New Unit</button>
            </form>
          </div>

          <div className="animate-slide-up" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937', animationDelay: '0.7s', opacity: 0 }}>
             <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ffffff' }}>Plant Equipment Pool</h3>
             
             <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
               <input 
                 type="text" 
                 placeholder="Search equipment by name..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 style={{ ...inputStyle, flex: 1, marginBottom: '0' }}
               />
               <select 
                 value={sortBy} 
                 onChange={(e) => setSortBy(e.target.value)} 
                 style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white', cursor: 'pointer' }}
               >
                 <option value="name">Sort by Name</option>
                 <option value="status">Sort by Status</option>
                 <option value="condition">Sort by Condition</option>
               </select>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
              {filteredEquipment.map((log, index) => (
                <div key={log._id} className="animate-slide-up card-hover" style={{ border: '1px solid #374151', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000000', animationDelay: `${0.8 + (index * 0.1)}s`, opacity: 0 }}>
                  <div style={{ height: '5px', backgroundColor: getStatusColor(log.status) }}></div>
                  <div style={{ padding: '20px' }}>
                    {editingId === log._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" name="equipmentName" value={editFormData.equipmentName} onChange={handleEditChange} style={{ padding: '8px', ...inputStyle }}/>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <select name="status" value={editFormData.status} onChange={handleEditChange} style={{ padding: '8px', ...inputStyle }}>
                            <option value="Operational">Operational</option>
                            <option value="Needs Maintenance">Maintenance</option>
                            <option value="Grounded">Grounded</option>
                            <option value="Offline">Offline</option>
                          </select>
                          <select name="condition" value={editFormData.condition} onChange={handleEditChange} style={{ padding: '8px', ...inputStyle }}>
                            <option value="New">New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                        <input type="text" name="technician" value={editFormData.technician} onChange={handleEditChange} style={{ padding: '8px', ...inputStyle }}/>
                        <input type="text" name="details" value={editFormData.details} onChange={handleEditChange} style={{ padding: '8px', ...inputStyle }}/>
                        <input type="text" name="notes" value={editFormData.notes} onChange={handleEditChange} style={{ padding: '8px', ...inputStyle }}/>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-hover" onClick={() => submitEdit(log._id)} style={{ flex: 1, padding: '8px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                          <button className="btn-hover" onClick={() => setEditingId(null)} style={{ flex: 1, padding: '8px', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>{log.equipmentName}</h4>
                        </div>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Status: <strong style={{ color: getStatusColor(log.status) }}>{log.status}</strong></p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Condition: <span style={{ color: '#d1d5db' }}>{log.condition || 'N/A'}</span></p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Engineer: <strong style={{ color: '#3b82f6' }}>{log.technician}</strong></p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Specs: <span style={{ color: '#d1d5db' }}>{log.details || 'N/A'}</span></p>
                        <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#9ca3af' }}>Notes: <span style={{ color: '#d1d5db' }}>{log.notes || 'None'}</span></p>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-hover" onClick={() => handleEditClick(log)} style={{ flex: 1, padding: '6px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Assign/Edit</button>
                          <button className="btn-hover" onClick={() => handleDelete(log._id)} style={{ flex: 1, padding: '6px', backgroundColor: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;