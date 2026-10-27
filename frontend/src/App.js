import { useState, useEffect } from 'react';
import Profile from './Profile';

function App() {
  const [activeScreen, setActiveScreen] = useState('login');
  
  const [userCreds, setUserCreds] = useState({ username: '', password: '' });
  const [authWarning, setAuthWarning] = useState('');

  const [machineList, setMachineList] = useState([]);
  const [newEntry, setNewEntry] = useState({
    equipmentName: '', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '', notes: ''
  });
  
  const [targetEditId, setTargetEditId] = useState(null);
  const [updateFields, setUpdateFields] = useState({});
  
  const [searchPhrase, setSearchPhrase] = useState('');
  const [orderingRule, setOrderingRule] = useState('name'); 

  useEffect(() => {
    console.log("Mounting component and fetching DB records...");
    fetch('http://localhost:5000/api/equipment')
      .then((response) => response.json())
      .then((resData) => {
        setMachineList(resData);
      })
      .catch((err) => {
        console.log("DB connection error");
      });
  }, []);

  const handleInputUpdate = (e) => {
    let copy = { ...newEntry };
    copy[e.target.name] = e.target.value;
    setNewEntry(copy);
  };

  const handleModifyChange = (e) => {
    let copy = { ...updateFields };
    copy[e.target.name] = e.target.value;
    setUpdateFields(copy);
  };

  const submitLoginAction = (e) => {
    e.preventDefault();
    if (userCreds.username.trim() === '' || userCreds.password.trim() === '') {
      setAuthWarning('Please enter both your username and password.');
      return;
    }
    setAuthWarning('');
    setActiveScreen('dashboard');
  };

  const triggerLogout = () => {
    setUserCreds({ username: '', password: '' });
    setActiveScreen('login');
  };

  const pushNewRecord = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    })
      .then((res) => res.json())
      .then((savedItem) => {
        let currentArray = [...machineList];
        currentArray.push(savedItem);
        setMachineList(currentArray);
        setNewEntry({ equipmentName: '', status: 'Operational', condition: 'Good', technician: 'Unassigned', details: '', notes: '' });
      });
  };

  const removeMachine = (targetId) => {
    fetch('http://localhost:5000/api/equipment/' + targetId, { method: 'DELETE' })
      .then(() => {
        let filtered = machineList.filter((item) => item._id !== targetId);
        setMachineList(filtered);
      });
  };

  const openEditor = (itemData) => {
    setTargetEditId(itemData._id);
    setUpdateFields(itemData);
  };

  const saveModifications = (recordId) => {
    fetch('http://localhost:5000/api/equipment/' + recordId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateFields)
    })
      .then((r) => r.json())
      .then((freshData) => {
        let mapped = machineList.map((m) => {
          if (m._id === recordId) {
            return freshData;
          } else {
            return m;
          }
        });
        setMachineList(mapped);
        setTargetEditId(null);
      });
  };

  const populateDatabase = async () => {
    console.log("Seeding started!");
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

    for (let i = 0; i < initialPool.length; i++) {
      await fetch('http://localhost:5000/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialPool[i])
      });
    }
    
    let finalReq = await fetch('http://localhost:5000/api/equipment');
    let fetchedArray = await finalReq.json();
    setMachineList(fetchedArray);
  };

  const getBadgeColor = (statusLabel) => {
    switch(statusLabel) {
      case 'Operational':
        return '#10b981';
      case 'Needs Maintenance':
        return '#f59e0b';
      case 'Grounded':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  let searchResults = [];
  for (let i = 0; i < machineList.length; i++) {
    if (machineList[i].equipmentName.toLowerCase().includes(searchPhrase.toLowerCase())) {
      searchResults.push(machineList[i]);
    }
  }

  searchResults.sort((itemA, itemB) => {
    if (orderingRule === 'status') {
      if (itemA.status < itemB.status) return -1;
      if (itemA.status > itemB.status) return 1;
      return 0;
    } else if (orderingRule === 'condition') {
      if (itemA.condition < itemB.condition) return -1;
      if (itemA.condition > itemB.condition) return 1;
      return 0;
    } else {
      if (itemA.equipmentName < itemB.equipmentName) return -1;
      if (itemA.equipmentName > itemB.equipmentName) return 1;
      return 0;
    }
  });

  const baseInputDesign = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white', boxSizing: 'border-box' };

  if (activeScreen === 'login') {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <style>
          {`@keyframes slideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; } .animate-fade-in { animation: fadeIn 0.8s ease-in-out forwards; } .btn-hover { transition: all 0.2s ease-in-out; } .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); } .card-hover { transition: all 0.3s ease; } .card-hover:hover { transform: translateY(-5px); border-color: #10b981 !important; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.1); }`}
        </style>
        <div className="animate-slide-up" style={{ display: 'flex', backgroundColor: '#111827', borderRadius: '16px', overflow: 'hidden', width: '850px', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.5)', minHeight: '450px', border: '1px solid #1f2937' }}>
          <div style={{ flex: 1, backgroundColor: '#10b981', color: '#000000', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '36px', marginBottom: '15px', fontWeight: '900', animationDelay: '0.1s', opacity: 0 }}>System Login</h1>
            <p className="animate-slide-up" style={{ lineHeight: '1.6', fontWeight: '500', animationDelay: '0.2s', opacity: 0 }}>Your telemetry companion to track operational status, physical conditions, and monitor power plant equipment effortlessly.</p>
          </div>
          <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="animate-slide-up" style={{ color: '#10b981', marginBottom: '25px', textAlign: 'center', animationDelay: '0.1s', opacity: 0 }}>Access Account</h2>
            <form onSubmit={submitLoginAction} className="animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              {authWarning && <div style={{ backgroundColor: '#ef444420', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', border: '1px solid #ef444450', textAlign: 'center' }}>{authWarning}</div>}
              <input type="text" name="username" placeholder="Username or Email" value={userCreds.username} onChange={(e) => setUserCreds({...userCreds, username: e.target.value})} style={{ ...baseInputDesign, marginBottom: '15px' }} />
              <input type="password" name="password" placeholder="Password" value={userCreds.password} onChange={(e) => setUserCreds({...userCreds, password: e.target.value})} style={{ ...baseInputDesign, marginBottom: '25px' }} />
              <button type="submit" className="btn-hover" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Login</button>
            </form>
            <p className="animate-slide-up" style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#9ca3af', animationDelay: '0.3s', opacity: 0 }}>Don't have an account? <span onClick={() => { setAuthWarning(''); setActiveScreen('register'); }} style={{ color: '#10b981', cursor: 'pointer', fontWeight: 'bold' }}>Register now</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (activeScreen === 'register') {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <style>
          {`@keyframes slideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; } .animate-fade-in { animation: fadeIn 0.8s ease-in-out forwards; } .btn-hover { transition: all 0.2s ease-in-out; } .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); } .card-hover { transition: all 0.3s ease; } .card-hover:hover { transform: translateY(-5px); border-color: #10b981 !important; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.1); }`}
        </style>
        <div className="animate-slide-up" style={{ display: 'flex', backgroundColor: '#111827', borderRadius: '16px', overflow: 'hidden', width: '900px', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.5)', minHeight: '500px', border: '1px solid #1f2937' }}>
          <div style={{ flex: 1, backgroundColor: '#10b981', color: '#000000', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '36px', marginBottom: '15px', fontWeight: '900', animationDelay: '0.1s', opacity: 0 }}>Join TelemetryMate</h1>
            <p className="animate-slide-up" style={{ lineHeight: '1.6', fontWeight: '500', animationDelay: '0.2s', opacity: 0 }}>Create an account to securely access the power plant database, assign engineers, and track real-time statistics.</p>
          </div>
          <div style={{ flex: 1.2, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="animate-slide-up" style={{ color: '#10b981', marginBottom: '25px', textAlign: 'center', animationDelay: '0.1s', opacity: 0 }}>Create Your Account</h2>
            <form onSubmit={(e) => { e.preventDefault(); setActiveScreen('login'); }} className="animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <input type="text" placeholder="Full Name" required style={baseInputDesign} />
                <input type="text" placeholder="Username" required style={baseInputDesign} />
              </div>
              <input type="email" placeholder="Email Address" required style={{ ...baseInputDesign, marginBottom: '15px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <input type="password" placeholder="Password" required style={baseInputDesign} />
                <input type="password" placeholder="Confirm Password" required style={baseInputDesign} />
              </div>
              <button type="submit" className="btn-hover" style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Register</button>
            </form>
            <p className="animate-slide-up" style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#9ca3af', animationDelay: '0.3s', opacity: 0 }}>Already have an account? <span onClick={() => setActiveScreen('login')} style={{ color: '#10b981', cursor: 'pointer', fontWeight: 'bold' }}>Login here</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (activeScreen === 'profile') {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#ffffff' }}>
        <style>
          {`@keyframes slideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; } .animate-fade-in { animation: fadeIn 0.8s ease-in-out forwards; } .btn-hover { transition: all 0.2s ease-in-out; } .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); } .card-hover { transition: all 0.3s ease; } .card-hover:hover { transform: translateY(-5px); border-color: #10b981 !important; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.1); }`}
        </style>
        <nav style={{ backgroundColor: '#111827', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937' }}>
          <h2 style={{ margin: 0, color: '#10b981' }}>TelemetryMate</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#d1d5db', fontWeight: '500' }}>Hi, {userCreds.username || 'Vishal S S'}</span>
            <button className="btn-hover" onClick={() => setActiveScreen('dashboard')} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Dashboard</button>
            <button className="btn-hover" onClick={triggerLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
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
        <style>
          {`@keyframes slideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; } .animate-fade-in { animation: fadeIn 0.8s ease-in-out forwards; } .btn-hover { transition: all 0.2s ease-in-out; } .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); } .card-hover { transition: all 0.3s ease; } .card-hover:hover { transform: translateY(-5px); border-color: #10b981 !important; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.1); }`}
        </style>
      <nav style={{ backgroundColor: '#111827', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937' }}>
        <h2 style={{ margin: 0, color: '#10b981' }}>TelemetryMate</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#d1d5db', fontWeight: '500' }}>Hi, {userCreds.username || 'Vishal S S'}</span>
          <button className="btn-hover" onClick={() => setActiveScreen('profile')} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Profile</button>
          <button className="btn-hover" onClick={triggerLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        
        <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937', animationDelay: '0.1s', opacity: 0 }}>
          <div>
            <h1 style={{ margin: 0, color: '#ffffff' }}>Welcome back, {userCreds.username || 'Vishal S S'}</h1>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Track equipment condition, manage plant modules, and assign technicians.</p>
          </div>
          {machineList.length === 0 && (
            <button className="btn-hover" onClick={populateDatabase} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              + Inject Initial 15 Power Plant Units
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.2s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Total Facility Units</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{machineList.length}</p>
          </div>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.3s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Fully Operational</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{machineList.filter(l => l.status === 'Operational').length}</p>
          </div>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.4s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Needs Maintenance</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{machineList.filter(l => l.status === 'Needs Maintenance').length}</p>
          </div>
          <div className="animate-slide-up card-hover" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f2937', animationDelay: '0.5s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '14px' }}>Currently Grounded</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{machineList.filter(l => l.status === 'Grounded').length}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="animate-slide-up" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937', animationDelay: '0.6s', opacity: 0 }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#ffffff' }}>Add / Import New Unit</h3>
            <form onSubmit={pushNewRecord} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <input type="text" name="equipmentName" placeholder="Unit Name (e.g. Pump 06)" value={newEntry.equipmentName} onChange={handleInputUpdate} required style={baseInputDesign}/>
              <select name="status" value={newEntry.status} onChange={handleInputUpdate} style={baseInputDesign}>
                <option value="Operational">Operational</option>
                <option value="Needs Maintenance">Maintenance</option>
                <option value="Grounded">Grounded</option>
                <option value="Offline">Offline</option>
              </select>
              <select name="condition" value={newEntry.condition} onChange={handleInputUpdate} style={baseInputDesign}>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Critical">Critical</option>
              </select>
              <input type="text" name="technician" placeholder="Assign Technician" value={newEntry.technician} onChange={handleInputUpdate} required style={baseInputDesign}/>
              <input type="text" name="details" placeholder="Rated Voltage / Details" value={newEntry.details} onChange={handleInputUpdate} style={baseInputDesign}/>
              <input type="text" name="notes" placeholder="Current Session Notes" value={newEntry.notes} onChange={handleInputUpdate} style={baseInputDesign}/>
              <button className="btn-hover" type="submit" style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Register New Unit</button>
            </form>
          </div>

          <div className="animate-slide-up" style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937', animationDelay: '0.7s', opacity: 0 }}>
             <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#ffffff' }}>Plant Equipment Pool</h3>
             
             <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
               <input 
                 type="text" 
                 placeholder="Search equipment by name..." 
                 value={searchPhrase}
                 onChange={(e) => setSearchPhrase(e.target.value)}
                 style={{ ...baseInputDesign, flex: 1, marginBottom: '0' }}
               />
               <select 
                 value={orderingRule} 
                 onChange={(e) => setOrderingRule(e.target.value)} 
                 style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white', cursor: 'pointer' }}
               >
                 <option value="name">Sort by Name</option>
                 <option value="status">Sort by Status</option>
                 <option value="condition">Sort by Condition</option>
               </select>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
              {searchResults.map((sysItem, idx) => (
                <div key={sysItem._id} className="animate-slide-up card-hover" style={{ border: '1px solid #374151', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000000', animationDelay: `${0.8 + (idx * 0.1)}s`, opacity: 0 }}>
                  <div style={{ height: '5px', backgroundColor: getBadgeColor(sysItem.status) }}></div>
                  <div style={{ padding: '20px' }}>
                    {targetEditId === sysItem._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" name="equipmentName" value={updateFields.equipmentName || ''} onChange={handleModifyChange} style={{ padding: '8px', ...baseInputDesign }}/>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <select name="status" value={updateFields.status || 'Operational'} onChange={handleModifyChange} style={{ padding: '8px', ...baseInputDesign }}>
                            <option value="Operational">Operational</option>
                            <option value="Needs Maintenance">Maintenance</option>
                            <option value="Grounded">Grounded</option>
                            <option value="Offline">Offline</option>
                          </select>
                          <select name="condition" value={updateFields.condition || 'New'} onChange={handleModifyChange} style={{ padding: '8px', ...baseInputDesign }}>
                            <option value="New">New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                        <input type="text" name="technician" value={updateFields.technician || ''} onChange={handleModifyChange} style={{ padding: '8px', ...baseInputDesign }}/>
                        <input type="text" name="details" value={updateFields.details || ''} onChange={handleModifyChange} style={{ padding: '8px', ...baseInputDesign }}/>
                        <input type="text" name="notes" value={updateFields.notes || ''} onChange={handleModifyChange} style={{ padding: '8px', ...baseInputDesign }}/>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-hover" onClick={() => saveModifications(sysItem._id)} style={{ flex: 1, padding: '8px', backgroundColor: '#10b981', color: '#000000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                          <button className="btn-hover" onClick={() => setTargetEditId(null)} style={{ flex: 1, padding: '8px', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>{sysItem.equipmentName}</h4>
                        </div>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Status: <strong style={{ color: getBadgeColor(sysItem.status) }}>{sysItem.status}</strong></p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Condition: <span style={{ color: '#d1d5db' }}>{sysItem.condition || 'N/A'}</span></p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Engineer: <strong style={{ color: '#3b82f6' }}>{sysItem.technician}</strong></p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#9ca3af' }}>Specs: <span style={{ color: '#d1d5db' }}>{sysItem.details || 'N/A'}</span></p>
                        <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#9ca3af' }}>Notes: <span style={{ color: '#d1d5db' }}>{sysItem.notes || 'None'}</span></p>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-hover" onClick={() => openEditor(sysItem)} style={{ flex: 1, padding: '6px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Assign/Edit</button>
                          <button className="btn-hover" onClick={() => removeMachine(sysItem._id)} style={{ flex: 1, padding: '6px', backgroundColor: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
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