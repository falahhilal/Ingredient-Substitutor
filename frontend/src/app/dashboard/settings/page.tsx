'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const user = {
    email: 'Mahrukh@123',
    username: 'MS',
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
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  useEffect(() => {
    if (preferences.length > 0) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

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

  const handleSaveSelectedNutrients = () => {
    const type = selectedPreferenceType === 'Allergy' ? 'Allergy' : 'Nutrient';
    const newPreferences = selectedNutrients.map((item) => ({
      type,
      value: item,
    }));
    setPreferences([...preferences, ...newPreferences]);
    setSelectedNutrients([]);
    setSelectedPreferenceType(null);
    setShowPreferenceOptions(false);
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

      {/* ADDING PREFERENCES SECTION */}
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

        {/* Display Preferences */}
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
