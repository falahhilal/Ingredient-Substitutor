/*'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const user = {
    email: localStorage.getItem('email'),
    username: localStorage.getItem('name'),
  };

  const [preferences, setPreferences] = useState<{ type: string; value: string }[]>([]);
  const [showPreferenceOptions, setShowPreferenceOptions] = useState(false);
  const [selectedPreferenceType, setSelectedPreferenceType] = useState<string | null>(null);
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([]);

  const nutrientOptions = [
    'High Sodium', 'Low Sodium',
    'High Protein', 'Low Protein',
    'High Calories', 'Low Calories',
    'High Carbohydrates', 'Low Carbohydrates',
    'High Sugar', 'Low Sugar',
    'High in Fat', 'Low in Fat',
  ];

  const allergyOptions = [
    'Gluten Allergy',
    'Peanut Allergy',
    'Lactose',
    'Soy Allergy',
    'Shellfish Allergy',
    'Egg Allergy',
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/preferences/preferences?email=${user.email}`);
        const data = await res.json();
        if (data.preferences) {
          setPreferences(JSON.parse(data.preferences));
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
      }
    };
  
    if (user.email) {
      fetchPreferences();
    }
  }, []);
  
  const handleLogout = () => {
    alert('Logging out...');
  };

  const handleCheckboxChange = (option: string) => {
    if (selectedNutrients.includes(option)) {
      setSelectedNutrients(selectedNutrients.filter((item) => item !== option));
    } else {
      setSelectedNutrients([...selectedNutrients, option]);
    }
  };

  const handleSaveSelectedNutrients = async () => {
    const type = selectedPreferenceType === 'Allergy' ? 'Allergy' : 'Nutrient';
    const newPreferences = selectedNutrients.map((item) => ({
      type,
      value: item,
    }));
    const updatedPreferences = [...preferences, ...newPreferences];
    setPreferences(updatedPreferences);
    setSelectedNutrients([]);
    setSelectedPreferenceType(null);
    setShowPreferenceOptions(false);
  
    // Save to backend
    try {
      await fetch('http://localhost:5000/api/preferences/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          preferences: updatedPreferences,
        }),
      });
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };
  
  const handleRemovePreference = (index: number) => {
    const updatedPreferences = preferences.filter((_, i) => i !== index);
    setPreferences(updatedPreferences);
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#c9edb6',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        color: '#4f4f4f',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Account Settings</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Username:</strong> {user.username}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Email:</strong> {user.email}
      </div>

      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#a2a2a2',
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginRight: '10px',
        }}
        onClick={() => alert('(DB logic pending)')}
      >
        Change Password
      </button>

      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff6b6b',
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px',
        }}
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* ADDING PREFERENCES SECTION *//*}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Preferences</h2>

        <button
          onClick={() => setShowPreferenceOptions(!showPreferenceOptions)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#a2a2a2',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Add Preferences
        </button>

        {showPreferenceOptions && (
          <div style={{ marginBottom: '20px' }}>
            {!selectedPreferenceType ? (
              <>
                <button
                  onClick={() => setSelectedPreferenceType('Allergy')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#a2a2a2',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginRight: '10px',
                    marginBottom: '10px',
                  }}
                >
                  Add Allergy
                </button>
                <button
                  onClick={() => setSelectedPreferenceType('Nutrient')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#a2a2a2',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '10px',
                  }}
                >
                  Add Nutrient Preference
                </button>
              </>
            ) : (
              <div>
                {(selectedPreferenceType === 'Allergy' ? allergyOptions : nutrientOptions).map((option) => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={selectedNutrients.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      style={{ marginRight: '8px' }}
                    />
                    {option}
                  </label>
                ))}
                <button
                  onClick={handleSaveSelectedNutrients}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#a2a2a2',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%',
                  }}
                >
                  Save Selected Preferences
                </button>
              </div>
            )}
          </div>
        )}

        {*//* Display Preferences *//*} 
        {preferences.length > 0 && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Your Preferences:</h3>
            <ul>
              {preferences.map((pref, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <strong>{pref.type}:</strong> {pref.value}
                  <button
                    onClick={() => handleRemovePreference(index)}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
*/
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const user = {
    email: localStorage.getItem('email'),
    username: localStorage.getItem('name'),
  };

  const [preferences, setPreferences] = useState<{ type: string; value: string }[]>([]);
  const [showPreferenceOptions, setShowPreferenceOptions] = useState(false);
  const [selectedPreferenceType, setSelectedPreferenceType] = useState<string | null>(null);
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const nutrientOptions = [
    'High Sodium', 'Low Sodium',
    'High Protein', 'Low Protein',
    'High Calories', 'Low Calories',
    'High Carbohydrates', 'Low Carbohydrates',
    'High Sugar', 'Low Sugar',
    'High in Fat', 'Low in Fat',
  ];

  const allergyOptions = [
    'Gluten Allergy',
    'Peanut Allergy',
    'Lactose',
    'Soy Allergy',
    'Shellfish Allergy',
    'Egg Allergy',
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/preferences/preferences?email=${user.email}`);
        const data = await res.json();
        if (data.preferences) {
          setPreferences(JSON.parse(data.preferences));
        } else {
          setPreferences(data); // fallback
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
      }
    };

    if (user.email) {
      fetchPreferences();
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/'); 
  };

  const handleCheckboxChange = (option: string) => {
    if (selectedNutrients.includes(option)) {
      setSelectedNutrients(selectedNutrients.filter((item) => item !== option));
    } else {
      setSelectedNutrients([...selectedNutrients, option]);
    }
  };

  const handleSaveSelectedNutrients = async () => {
    const type = selectedPreferenceType === 'Allergy' ? 'Allergy' : 'Nutrient';
    const newPreferences = selectedNutrients.map((item) => ({
      type,
      value: item,
    }));
    const updatedPreferences = [...preferences, ...newPreferences];
    setPreferences(updatedPreferences);
    setSelectedNutrients([]);
    setSelectedPreferenceType(null);
    setShowPreferenceOptions(false);

    try {
      await fetch('http://localhost:5000/api/preferences/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          preferences: updatedPreferences,
        }),
      });
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  const handleRemovePreference = (index: number) => {
    const updatedPreferences = preferences.filter((_, i) => i !== index);
    setPreferences(updatedPreferences);
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/preferences/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Password change failed');
      } else {
        setSuccess('Password changed successfully');
        setTimeout(() => setShowPasswordModal(false), 1000);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#c9edb6', padding: '40px', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', color: '#4f4f4f' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Account Settings</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Username:</strong> {user.username}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Email:</strong> {user.email}
      </div>

      <button
        style={{ padding: '10px 20px', backgroundColor: '#a2a2a2', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}
        onClick={() => setShowPasswordModal(true)}
      >
        Change Password
      </button>

      <button
        style={{ padding: '10px 20px', backgroundColor: '#ff6b6b', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
        onClick={handleLogout}
      >
        Logout
      </button>

      {showPasswordModal && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '300px' }}>
            <h3>Change Password</h3>
            <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <button onClick={handleChangePassword} style={{ marginRight: '10px' }}>Submit</button>
            <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Preferences Section */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Preferences</h2>

        <button
          onClick={() => setShowPreferenceOptions(!showPreferenceOptions)}
          style={{ padding: '8px 16px', backgroundColor: '#a2a2a2', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}
        >
          Add Preferences
        </button>

        {showPreferenceOptions && (
          <div style={{ marginBottom: '20px' }}>
            {!selectedPreferenceType ? (
              <>
                <button onClick={() => setSelectedPreferenceType('Allergy')} style={{ padding: '8px 16px', marginRight: '10px', marginBottom: '10px' }}>Add Allergy</button>
                <button onClick={() => setSelectedPreferenceType('Nutrient')} style={{ padding: '8px 16px', marginBottom: '10px' }}>Add Nutrient Preference</button>
              </>
            ) : (
              <div>
                {(selectedPreferenceType === 'Allergy' ? allergyOptions : nutrientOptions).map((option) => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <input type="checkbox" checked={selectedNutrients.includes(option)} onChange={() => handleCheckboxChange(option)} style={{ marginRight: '8px' }} />
                    {option}
                  </label>
                ))}
                <button onClick={handleSaveSelectedNutrients} style={{ padding: '8px 16px', width: '100%' }}>Save Selected Preferences</button>
              </div>
            )}
          </div>
        )}

        {preferences.length > 0 && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Your Preferences:</h3>
            <ul>
              {preferences.map((pref, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <strong>{pref.type}:</strong> {pref.value}
                  <button
                    onClick={() => handleRemovePreference(index)}
                    style={{ marginLeft: '10px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}