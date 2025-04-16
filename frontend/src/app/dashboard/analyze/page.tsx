'use client';

import React, { useState, useEffect } from 'react';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'auto',
  minHeight: '300px',
  backgroundColor: '#c9edb6',
  padding: '30px',
  borderRadius: '15px',
  width: '350px',
  margin: '80px auto 0',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  margin: '10px 0',
  fontSize: '16px',
  borderRadius: '15px',
  border: '1px solid #a2a2a2',
  backgroundColor: '#a2a2a2',
  color: 'white',
  width: '100%',
};

const buttonStyle: React.CSSProperties = {
  padding: '15px 30px',
  margin: '10px auto',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '15px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  display: 'block',
  width: '200px',
};

const productOptions = [
  { label: 'Cola Next', value: 'cola' },
  { label: 'Chocolato', value: 'chocolato' },
  { label: 'Cocomo', value: 'cocomo' },
  { label: 'Protein Bar', value: 'protein_bar' },
  { label: 'Low Fat Milk', value: 'low_fat_milk' },
];

export default function AnalyzeProductPage() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [result, setResult] = useState<any>(null);
  const [mlResult, setMLResult] = useState<any>(null);
  const [mlAnalysis, setMlAnalysis] = useState<any>(null);

  const [preferences, setPreferences] = useState({
    diabetic: false,
    vegan: false,
    lowSodium: false,
    halal: false,
    lactoseIntolerant: false,
    lowFat: false,
    highProtein: false,
  });

  useEffect(() => {
    const storedPrefs = localStorage.getItem('preferences');
    if (storedPrefs) {
      setPreferences({ 
        diabetic: false,
        vegan: false,
        lowSodium: false,
        halal: false,
        lactoseIntolerant: false,
        lowFat: false,
        highProtein: false,
        ...JSON.parse(storedPrefs) 
      });
    }
  }, []);

  const handleAnalyze = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(`/data/${selectedProduct}.json`);
      const data = await res.json();
      setResult(data);
  
      const mlRes = await fetch('/data/ml_analysis.json'); 
      const mlData = await mlRes.json();
      setMlAnalysis(mlData);
  
    } catch (error) {
      console.error('Error fetching product or ML data:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '24px', color: 'black' }}>Analyze Product</h1>

      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        style={{ ...inputStyle, backgroundColor: 'white', color: 'black' }}
      >
        <option value="">Select a product</option>
        {productOptions.map((product) => (
          <option key={product.value} value={product.value}>
            {product.label}
          </option>
        ))}
      </select>

      <button style={buttonStyle} onClick={handleAnalyze}>
        Analyze
      </button>

      {result && (
        <div style={{ marginTop: '20px', color: 'black' }}>
          <h3>Nutrition Facts:</h3>
          <p>Sugar: {result.sugar}g</p>
          <p>Fat: {result.fat}g</p>
          <p>Sodium: {result.sodium}mg</p>
          <p>Protein: {result.protein}g</p>

          <h4>Dietary Preference Verdict:</h4>

          {preferences.diabetic && result.sugar > 5 && (
            <p>⚠️ Not suitable for diabetics (high sugar)</p>
          )}

          {preferences.lowSodium && result.sodium > 150 && (
            <p>⚠️ Not suitable for low-sodium diets</p>
          )}
          {preferences.lowSodium && result.sodium <= 150 && (
            <p>✅ Low in sodium (suitable for low-sodium diets)</p>
          )}

          {preferences.vegan && !result.vegan && (
            <p>⚠️ Not suitable for vegans</p>
          )}
          {preferences.vegan && result.vegan && (
            <p>✅ Suitable for vegans</p>
          )}

          {preferences.halal && !result.halal && (
            <p>⚠️ Not Halal</p>
          )}
          {preferences.halal && result.halal && (
            <p>✅ Halal certified</p>
          )}

          {preferences.lactoseIntolerant && result.containsLactose && (
            <p>⚠️ Contains lactose (not suitable for lactose intolerant)</p>
          )}
          {preferences.lactoseIntolerant && !result.containsLactose && (
            <p>✅ Lactose free (suitable for lactose intolerant)</p>
          )}
          
          {preferences.lowFat && result.fat > 5 && (
            <p>⚠️ Not suitable for low-fat diets</p>
          )}
          {preferences.lowFat && result.fat <= 5 && (
            <p>✅ Low in fat (suitable for low-fat diets)</p>
          )}

          {preferences.highProtein && result.protein < 5 && (
            <p>⚠️ Not a good source of protein</p>
          )}
          {preferences.highProtein && result.protein >= 5 && (
            <p>✅ High in protein (suitable for high-protein diets)</p>
          )}

          <h4>Nutritional Analysis:</h4>
          <p>{result.sugar > 10 ? '⚠️ High in sugar' : '✅ Sugar level is moderate'}</p>
          <p>{result.fat > 10 ? '⚠️ High in fat' : '✅ Fat level is acceptable'}</p>
          <p>{result.sodium > 150 ? '⚠️ High sodium content' : '✅ Sodium level is safe'}</p>
          <p>{result.protein >= 5 ? '✅ Good protein source' : '⚠️ Low in protein'}</p>

          {mlResult && (
            <div style={{ marginTop: '20px' }}>
              <h4>⚙️ ML Model Analysis:</h4>
              <p><strong>Additive Risk:</strong> {mlResult.additiveRisk} ({mlResult.additiveScore}%)</p>
              <p><strong>Processing Level:</strong> {mlResult.processingLevel} ({mlResult.processingScore}%)</p>
              <p><strong>Claim Accuracy:</strong> {mlResult.claimAccuracy} ({mlResult.claimScore}%)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
