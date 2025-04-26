'use client';

import React, { useState, useEffect } from 'react';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  backgroundColor: '#c9edb6',
  padding: '30px',
  borderRadius: '15px',
  width: '400px',
  margin: '80px auto 0',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  margin: '5px 0',
  fontSize: '16px',
  borderRadius: '10px',
  border: '1px solid #a2a2a2',
  backgroundColor: '#a2a2a2',
  color: 'white',
  width: '100%',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  margin: '8px 5px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '10px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
};

const recipeCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '15px',
  margin: '10px 0',
  width: '100%',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  cursor: 'pointer',
};

const popupOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const popupContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '320px', // smaller popup
};

export default function AddRecipePage() {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [instructions, setInstructions] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupIngredient, setPopupIngredient] = useState({
    name: '',
    quantity: '',
    calories: '',
    fats: '',
    carbs: '',
    sodium: '',
    sugar: '',
  });

  // Save recipes to localStorage
  useEffect(() => {
    const storedRecipes = localStorage.getItem('savedRecipes');
    if (storedRecipes) {
      setSavedRecipes(JSON.parse(storedRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const openAddIngredientPopup = () => {
    setPopupIngredient({
      name: '',
      quantity: '',
      calories: '',
      fats: '',
      carbs: '',
      sodium: '',
      sugar: '',
    });
    setIsPopupOpen(true);
  };

  const handlePopupChange = (field: keyof typeof popupIngredient, value: string) => {
    setPopupIngredient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveIngredient = () => {
    const fields = Object.values(popupIngredient);
    if (fields.some((field) => field.trim() === '')) {
      alert('All fields must be filled!');
      return;
    }
    setIngredients([...ingredients, popupIngredient]);
    setIsPopupOpen(false);
  };

  const handleSaveRecipe = () => {
    if (!recipeName || ingredients.length === 0 || !instructions) {
      alert('Please complete all fields!');
      return;
    }
    const newRecipe = {
      name: recipeName,
      ingredients,
      instructions,
    };
    setSavedRecipes([...savedRecipes, newRecipe]);
    setRecipeName('');
    setIngredients([]);
    setInstructions('');
  };

  const toggleExpandRecipe = (index: number) => {
    setExpandedRecipeIndex(index === expandedRecipeIndex ? null : index);
  };

  const deleteIngredient = (index: number) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  const editIngredient = (index: number) => {
    setPopupIngredient(ingredients[index]);
    deleteIngredient(index);
    setIsPopupOpen(true);
  };

  const calculateTotals = () => {
    const totals = { calories: 0, fats: 0, carbs: 0, sodium: 0, sugar: 0 };
    ingredients.forEach((ingredient) => {
      totals.calories += parseInt(ingredient.calories) || 0;
      totals.fats += parseInt(ingredient.fats) || 0;
      totals.carbs += parseInt(ingredient.carbs) || 0;
      totals.sodium += parseInt(ingredient.sodium) || 0;
      totals.sugar += parseInt(ingredient.sugar) || 0;
    });
    return totals;
  };

  const totals = calculateTotals();

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
      <h1 style={{ fontSize: '24px', color: '#4f4f4f' }}>Add New Recipe</h1>

      <input
        type="text"
        placeholder="Recipe Name"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        style={inputStyle}
      />

      <button onClick={openAddIngredientPopup} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>
        + Add Ingredient
      </button>

      {ingredients.length > 0 && (
        <div style={{ marginTop: '20px', width: '100%' }}>
          <h2 style={{ fontSize: '20px', color: '#4f4f4f' }}>🧂 Ingredients</h2>
          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ marginBottom: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px' }}>
              <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                {ingredient.name} - {ingredient.quantity}
              </div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                {ingredient.calories} kcal | {ingredient.fats}g fats | {ingredient.carbs}g carbs | {ingredient.sodium}mg sodium | {ingredient.sugar}g sugar
              </div>
              <button onClick={() => editIngredient(index)} style={{ ...buttonStyle, backgroundColor: '#81c784', fontSize: '12px' }}>
                Edit
              </button>
              <button onClick={() => deleteIngredient(index)} style={{ ...buttonStyle, backgroundColor: '#f44336', fontSize: '12px' }}>
                Delete
              </button>
            </div>
          ))}
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '8px' }}>
            <strong>Total:</strong><br/>
            Calories: {totals.calories} kcal | Fats: {totals.fats}g | Carbs: {totals.carbs}g | Sodium: {totals.sodium}mg | Sugar: {totals.sugar}g
          </div>
        </div>
      )}

      <h3 style={{ color: '#4f4f4f', marginTop: '20px' }}>Description:</h3>
      <textarea
        placeholder="Write recipe description here..."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        style={{
          ...inputStyle,
          height: '100px',
          resize: 'vertical',
        }}
      />

      <button onClick={handleSaveRecipe} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>
        Save Recipe
      </button>

      {savedRecipes.length > 0 && (
        <div style={{ marginTop: '30px', width: '100%' }}>
          <h2 style={{ fontSize: '22px', color: '#4f4f4f' }}>📜 Saved Recipes</h2>
          {savedRecipes.map((recipe, index) => (
            <div
              key={index}
              style={recipeCardStyle}
              onClick={() => toggleExpandRecipe(index)}
            >
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#4CAF50', marginBottom: '5px' }}>{recipe.name}</div>

              {expandedRecipeIndex === index && (
                <div style={{ marginTop: '10px', color: '#4f4f4f' }}>
                  <h4>Ingredients:</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {recipe.ingredients.map((ingredient: any, idx: number) => (
                      <li key={idx}>
                        {ingredient.quantity} of {ingredient.name}
                      </li>
                    ))}
                  </ul>

                  <h4>Instructions:</h4>
                  <p>{recipe.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POPUP */}
      {isPopupOpen && (
      <div style={popupOverlayStyle}>
        <div style={{
          ...popupContentStyle,
          maxHeight: '90vh', // prevent overflow
          overflowY: 'auto', // scroll inside popup if content is too big
          width: '90%',
          maxWidth: '300px', // even smaller
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Add Ingredient</h2>

          {['name', 'quantity', 'calories', 'fats', 'carbs', 'sodium', 'sugar'].map((field) => (
          <div key={field} style={{ marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold', color: '#555' }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              placeholder={field}
              value={(popupIngredient as any)[field]}
              onChange={(e) => handlePopupChange(field as keyof typeof popupIngredient, e.target.value)}
              style={inputStyle}
            />
          </div>
          ))}

          <button onClick={saveIngredient} style={{ ...buttonStyle, backgroundColor: '#4CAF50', width: '100%' }}>
          Save Ingredient
          </button>
          <button onClick={() => setIsPopupOpen(false)} style={{ ...buttonStyle, backgroundColor: '#f44336', width: '100%' }}>
          Cancel
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
