'use client';

import React, { useState, useEffect } from 'react';

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
  maxWidth: '340px',
  maxHeight: '80vh', 
  overflowY: 'auto',  
  overflowX:'hidden',
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

  const [allIngredients, setAllIngredients] = useState<any[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedRecipes = localStorage.getItem('savedRecipes');
    if (storedRecipes) {
      setSavedRecipes(JSON.parse(storedRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    const ingredientData = [
      {
        name: 'Tomato',
        quantity: '1 medium',
        calories: '22',
        fats: '0.2',
        carbs: '4.8',
        sodium: '6',
        sugar: '3.2',
      },
      {
        name: 'Chicken Breast',
        quantity: '100g',
        calories: '165',
        fats: '3.6',
        carbs: '0',
        sodium: '74',
        sugar: '0',
      },
      {
        name: 'Rice (Cooked)',
        quantity: '1 cup',
        calories: '206',
        fats: '0.4',
        carbs: '45',
        sodium: '1',
        sugar: '0.1',
      },
      {
        name: 'Olive Oil',
        quantity: '1 tbsp',
        calories: '119',
        fats: '13.5',
        carbs: '0',
        sodium: '0.3',
        sugar: '0',
      },
      {
        name: 'Salt',
        quantity: '1 tsp',
        calories: '0',
        fats: '0',
        carbs: '0',
        sodium: '2325',
        sugar: '0',
      }
    ];
    setAllIngredients(ingredientData);
  }, []);

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
      totals.calories += parseFloat(ingredient.calories) || 0;
      totals.fats += parseFloat(ingredient.fats) || 0;
      totals.carbs += parseFloat(ingredient.carbs) || 0;
      totals.sodium += parseFloat(ingredient.sodium) || 0;
      totals.sugar += parseFloat(ingredient.sugar) || 0;
    });
    return totals;
  };

  const totals = calculateTotals();

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#c9edb6',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      color: '#4f4f4f',
    }}>
      <h1>Add New Recipe</h1>

      <input
        type="text"
        placeholder="Recipe Name"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        style={inputStyle}
      />

      <div>
        <button onClick={openAddIngredientPopup} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>
          + Add New Ingredient
        </button>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ ...buttonStyle, backgroundColor: '#81c784' }}
        >
          + Select Ingredient
        </button>
      </div>

      {isDropdownOpen && (
        <div style={{ marginTop: '10px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search ingredients..."
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            style={inputStyle}
          />
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {allIngredients
              .filter((ingredient) =>
                ingredient.name.toLowerCase().includes(ingredientSearch.toLowerCase())
              )
              .map((ingredient, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setIngredients([...ingredients, ingredient]);
                    setIsDropdownOpen(false);
                    setIngredientSearch('');
                  }}
                  style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  {ingredient.name}
                </div>
              ))}
          </div>
        </div>
      )}

      {ingredients.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>🧂 Ingredients</h2>
          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ backgroundColor: '#fff', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
              <div><strong>{ingredient.name}</strong> - {ingredient.quantity}</div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                {ingredient.calories} kcal | {ingredient.fats}g fats | {ingredient.carbs}g carbs | {ingredient.sodium}mg sodium | {ingredient.sugar}g sugar
              </div>
              <button onClick={() => editIngredient(index)} style={{ ...buttonStyle, backgroundColor: '#81c784', fontSize: '12px' }}>Edit</button>
              <button onClick={() => deleteIngredient(index)} style={{ ...buttonStyle, backgroundColor: '#f44336', fontSize: '12px' }}>Delete</button>
            </div>
          ))}
          <div style={{ marginTop: '10px' }}>
            <strong>Total:</strong> {totals.calories} kcal | {totals.fats}g fats | {totals.carbs}g carbs | {totals.sodium}mg sodium | {totals.sugar}g sugar
          </div>
        </div>
      )}

      <h3>Description:</h3>
      <textarea
        placeholder="Write recipe description here..."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
      />

      <button onClick={handleSaveRecipe} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>
        Save Recipe
      </button>

      {savedRecipes.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>📜 Saved Recipes</h2>
          {savedRecipes.map((recipe, index) => (
            <div key={index} style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '15px',
              margin: '10px 0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }} onClick={() => setExpandedRecipeIndex(index === expandedRecipeIndex ? null : index)}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#4CAF50' }}>{recipe.name}</div>
              {expandedRecipeIndex === index && (
                <div>
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ing: any, idx: number) => (
                      <li key={idx}>{ing.quantity} of {ing.name}</li>
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

      {isPopupOpen && (
        <div style={popupOverlayStyle}>
          <div style={popupContentStyle}>
            <h2>Add Ingredient</h2>
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
