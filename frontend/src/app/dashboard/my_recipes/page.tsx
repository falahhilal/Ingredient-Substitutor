/*'use client';

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
  overflowX: 'hidden',
};

type Ingredient = {
  name: string;
  calories: string;
  fats: string;
  carbs: string;
  sodium: string;
  sugar: string;
  protein?: string;
  cost?: string;
  quantity?: string;
};

export default function AddRecipePage() {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupIngredient, setPopupIngredient] = useState<Ingredient>({
    name: '',
    calories: '',
    fats: '',
    carbs: '',
    sodium: '',
    sugar: '',
    protein: '0',
    cost: '0',
    quantity: '1'
  });

  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDropdownIngredient, setSelectedDropdownIngredient] = useState<Ingredient | null>(null);
  const [isQuantityPopupOpen, setIsQuantityPopupOpen] = useState(false);
  const [dropdownQuantity, setDropdownQuantity] = useState('');

  // Fetch all ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const userEmail = localStorage.getItem('email') || '';
        const response = await fetch(`http://localhost:5000/api/ingredients/list?user_email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        if (response.ok) {
          setAllIngredients(data);
        } else {
          console.error('Error fetching ingredients:', data.message);
        }
      } catch (err) {
        console.error('Error fetching ingredients:', err);
      }
    };
    fetchIngredients();
  }, []);

  // Fetch saved recipes
  const fetchRecipes = async () => {
    try {
      const userEmail = localStorage.getItem('email') || '';
      const response = await fetch(`http://localhost:5000/api/recipes/list?user_email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (response.ok) {
        setSavedRecipes(data);
      } else {
        console.error('Error fetching recipes:', data.message);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Open add ingredient popup
  const openAddIngredientPopup = () => {
    setPopupIngredient({
      name: '',
      calories: '',
      fats: '',
      carbs: '',
      sodium: '',
      sugar: '',
      protein: '0',
      cost: '0',
      quantity: '1'
    });
    setIsPopupOpen(true);
  };

  const handlePopupChange = (field: keyof Ingredient, value: string) => {
    setPopupIngredient(prev => ({ ...prev, [field]: value }));
  };

  const saveIngredient = () => {
    const fields = Object.values(popupIngredient);
    if (fields.some(f => f === '' || f === undefined)) {
      alert('All fields must be filled!');
      return;
    }

    setIngredients([...ingredients, { ...popupIngredient }]);
    setIsPopupOpen(false);
  };

  const handleSaveRecipe = async () => {
    if (!recipeName || ingredients.length === 0 || !instructions) {
      alert('Please complete all fields!');
      return;
    }

    const newRecipe = {
      name: recipeName,
      description: instructions,
      user_email: localStorage.getItem('email'),
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        quantity: Number(ing.quantity),
        calories: Number(ing.calories),
        fats: Number(ing.fats),
        carbs: Number(ing.carbs),
        sodium: Number(ing.sodium),
        sugar: Number(ing.sugar),
        protein: Number(ing.protein || 0),
        cost: Number(ing.cost || 0)
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/recipes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe)
      });
      const data = await response.json();
      if (response.ok) {
        setSavedRecipes([...savedRecipes, data]);
        setRecipeName('');
        setIngredients([]);
        setInstructions('');
        fetchRecipes();
      } else {
        console.error('Error saving recipe:', data.message);
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  };

  const deleteIngredient = (index: number) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  const editIngredient = (index: number) => {
    setPopupIngredient({ ...ingredients[index] });
    deleteIngredient(index);
    setIsPopupOpen(true);
  };

  const calculateTotals = () => {
    const totals = { calories: 0, fats: 0, carbs: 0, sodium: 0, sugar: 0 };
    ingredients.forEach(ing => {
      totals.calories += Number(ing.calories || 0);
      totals.fats += Number(ing.fats || 0);
      totals.carbs += Number(ing.carbs || 0);
      totals.sodium += Number(ing.sodium || 0);
      totals.sugar += Number(ing.sugar || 0);
    });
    return totals;
  };

  const handleDropdownIngredientClick = (ingredient: Ingredient) => {
    setSelectedDropdownIngredient(ingredient);
    setDropdownQuantity('');
    setIsQuantityPopupOpen(true);
    setIsDropdownOpen(false);
  };

  const saveDropdownIngredientWithQuantity = () => {
    if (!dropdownQuantity.trim()) {
      alert('Quantity is required');
      return;
    }
    if (!selectedDropdownIngredient) return;

    setIngredients([...ingredients, {
      name: selectedDropdownIngredient.name,
      calories: selectedDropdownIngredient.calories || '0',
      fats: selectedDropdownIngredient.fats || '0',
      carbs: selectedDropdownIngredient.carbs || '0',
      sodium: selectedDropdownIngredient.sodium || '0',
      sugar: selectedDropdownIngredient.sugar || '0',
      protein: selectedDropdownIngredient.protein || '0',
      cost: selectedDropdownIngredient.cost || '0',
      quantity: dropdownQuantity
    }]);

    setIsQuantityPopupOpen(false);
    setSelectedDropdownIngredient(null);
    setDropdownQuantity('');
  };

  const totals = calculateTotals();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#c9edb6', padding: '40px', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', color: '#4f4f4f' }}>
      <h1>Add New Recipe</h1>

      <input type="text" placeholder="Recipe Name" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} style={inputStyle} />

      <div>
        <button onClick={openAddIngredientPopup} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>+ Add New Ingredient</button>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>+ Select Ingredient</button>
      </div>

      {isDropdownOpen && (
        <div style={{ marginTop: '10px', width: '100%' }}>
          <input type="text" placeholder="Search ingredients..." value={ingredientSearch} onChange={(e) => setIngredientSearch(e.target.value)} style={inputStyle} />
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {allIngredients.filter(ing => ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()))
              .map((ing, idx) => (
                <div key={idx} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => handleDropdownIngredientClick(ing)}>
                  {ing.name}
                </div>
              ))}
          </div>
        </div>
      )}

      {isQuantityPopupOpen && (
        <div style={popupOverlayStyle}>
          <div style={popupContentStyle}>
            <h2>Enter Quantity (tbsp) for {selectedDropdownIngredient?.name}</h2>
            <input type="text" placeholder="Quantity" value={dropdownQuantity} onChange={(e) => setDropdownQuantity(e.target.value)} style={inputStyle} />
            <button onClick={saveDropdownIngredientWithQuantity} style={{ ...buttonStyle, backgroundColor: '#4CAF50', width: '100%' }}>Save</button>
            <button onClick={() => setIsQuantityPopupOpen(false)} style={{ ...buttonStyle, backgroundColor: '#f44336', width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}

      {ingredients.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>🧂 Ingredients</h2>
          {ingredients.map((ing, idx) => (
            <div key={idx} style={{ backgroundColor: '#fff', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
              <div><strong>{ing.name}</strong> - {ing.quantity}</div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                {ing.calories} kcal | {ing.fats}g fats | {ing.carbs}g carbs | {ing.sodium}mg sodium | {ing.sugar}g sugar
              </div>
              <button onClick={() => editIngredient(idx)} style={{ ...buttonStyle, backgroundColor: '#81c784', fontSize: '12px' }}>Edit</button>
              <button onClick={() => deleteIngredient(idx)} style={{ ...buttonStyle, backgroundColor: '#f44336', fontSize: '12px' }}>Delete</button>
            </div>
          ))}
          <div style={{ marginTop: '10px' }}>
            <strong>Total:</strong> {totals.calories} kcal | {totals.fats}g fats | {totals.carbs}g carbs | {totals.sodium}mg sodium | {totals.sugar}g sugar
          </div>
        </div>
      )}

      <h3>Description:</h3>
      <textarea placeholder="Write recipe description here..." value={instructions} onChange={(e) => setInstructions(e.target.value)} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />

      <button onClick={handleSaveRecipe} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>Save Recipe</button>

      {savedRecipes.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>📜 Saved Recipes</h2>
          {savedRecipes.map((recipe, index) => (
            <div key={index} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '15px', margin: '10px 0', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={() => setExpandedRecipeIndex(index === expandedRecipeIndex ? null : index)}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#4CAF50' }}>{recipe.name}</div>
              {expandedRecipeIndex === index && (
                <div>
                  <h4>Ingredients:</h4>
                  <ul>
                    {Array.isArray(recipe.ingredients) &&
                      recipe.ingredients.map((ing: any, idx2: number) => (
                        <li key={idx2}>{ing.quantity} of {ing.name}</li>
                      ))}
                  </ul>
                  <h4>Instructions:</h4>
                  <p>{recipe.description}</p>
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
            {['name', 'calories', 'fats', 'carbs', 'sodium', 'sugar', 'protein', 'cost'].map(field => (
              <div key={field} style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: 'bold', color: '#555' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input type="text" placeholder={field} value={popupIngredient[field as keyof Ingredient] ?? ''} onChange={(e) => handlePopupChange(field as keyof Ingredient, e.target.value)} style={inputStyle} />
              </div>
            ))}
            <button onClick={saveIngredient} style={{ ...buttonStyle, backgroundColor: '#4CAF50', width: '100%' }}>Save Ingredient</button>
            <button onClick={() => setIsPopupOpen(false)} style={{ ...buttonStyle, backgroundColor: '#f44336', width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
*/


/*
'use client';

import React, { useEffect, useState } from 'react';

type Ingredient = { name: string; quantity: number };
type Recipe = { recipe_id: number; name: string; description: string; user_email: string; ingredients: Ingredient[]; visibility: string; created_at: string };

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [ratingValue, setRatingValue] = useState<{ [key: number]: number }>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUserEmail(localStorage.getItem('email') || '');
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/list?user_email=${encodeURIComponent(localStorage.getItem('email') || '')}`);
      const data = await res.json();
      setRecipes(data);
    } catch (err) { console.error(err); }
  };

  const handleRate = async (recipe_id: number, value: number) => {
    try {
      await fetch('http://localhost:5000/api/recipes/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id, user_email: userEmail, rating: value })
      });
      setRatingValue(prev => ({ ...prev, [recipe_id]: value }));
    } catch (err) { console.error(err); }
  };

  const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '30px', backgroundColor: '#c9edb6', borderRadius: '12px' }}>
      <h1>🍲 Recipes Feed</h1>
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #a2a2a2', backgroundColor: '#a2a2a2', color: 'white' }}
      />

      {filteredRecipes.map((recipe) => (
        <div key={recipe.recipe_id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '15px', marginBottom: '15px' }}>
          <h2 style={{ color: '#4CAF50' }}>{recipe.name}</h2>
          <p>{recipe.description}</p>
          <div><strong>Ingredients:</strong> {recipe.ingredients.map(i => `${i.quantity} of ${i.name}`).join(', ')}</div>
          <div>
            <strong>Rate:</strong>
            {[1,2,3,4,5].map(num => (
              <span
                key={num}
                style={{ cursor: 'pointer', color: (ratingValue[recipe.recipe_id] || 0) >= num ? 'gold' : '#ccc', fontSize: '20px', marginLeft: '5px' }}
                onClick={() => handleRate(recipe.recipe_id, num)}
              >★</span>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>Posted by: {recipe.user_email} | {new Date(recipe.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
*/

'use client';

import React, { useEffect, useState } from 'react';

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
  overflowX: 'hidden',
};

type Ingredient = {
  name: string;
  calories: string;
  fats: string;
  carbs: string;
  sodium: string;
  sugar: string;
  protein?: string;
  cost?: string;
  quantity?: string;
};

type FeedIngredient = { name: string; quantity: number };

type RecipeFeedItem = {
  recipe_id: number;
  name: string;
  description: string;
  user_email: string;
  ingredients: FeedIngredient[];
  visibility: string;
  created_at: string;
};

export default function RecipesPage() {
  // Tab: 'add' or 'feed'
  const [activeTab, setActiveTab] = useState<'add' | 'feed'>('add');

  // Add-recipe state
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupIngredient, setPopupIngredient] = useState<Ingredient>({
    name: '',
    calories: '',
    fats: '',
    carbs: '',
    sodium: '',
    sugar: '',
    protein: '0',
    cost: '0',
    quantity: '1',
  });

  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDropdownIngredient, setSelectedDropdownIngredient] = useState<Ingredient | null>(null);
  const [isQuantityPopupOpen, setIsQuantityPopupOpen] = useState(false);
  const [dropdownQuantity, setDropdownQuantity] = useState('');

  // Per-ingredient edit mode: index being edited, and a local edit copy
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // Feed state
  const [recipes, setRecipes] = useState<RecipeFeedItem[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [ratingValue, setRatingValue] = useState<{ [key: number]: number }>({});
  const [search, setSearch] = useState('');

  // Ratings summary state (avg + count) per recipe
  const [ratingsSummary, setRatingsSummary] = useState<{ [key: number]: { avg_rating: number; total_ratings: number } }>({});

  // Load user email and initial lists
  useEffect(() => {
    const email = localStorage.getItem('email') || '';
    setUserEmail(email);
    fetchIngredients(email);
    fetchRecipes(email);
  }, []);

  // Fetch available ingredients (for dropdown selection)
  const fetchIngredients = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ingredients/list?user_email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) setAllIngredients(data);
      else console.error('fetchIngredients error', data);
    } catch (err) {
      console.error('fetchIngredients', err);
    }
  };

  // Fetch one recipe's rating summary
  const fetchRating = async (recipe_id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/ratings?recipe_id=${encodeURIComponent(String(recipe_id))}`);
      const data = await res.json();
      if (res.ok) {
        setRatingsSummary(prev => ({
          ...prev,
          [recipe_id]: { avg_rating: Number(data.avg_rating || 0), total_ratings: Number(data.total_ratings || 0) },
        }));
      }
    } catch (err) {
      console.error('fetchRating', err);
    }
  };

  // Fetch recipes for feed (public + own) and then load rating summaries
  const fetchRecipes = async (email?: string) => {
    try {
      const user = email ?? localStorage.getItem('email') ?? '';
      const res = await fetch(`http://localhost:5000/api/recipes/list?user_email=${encodeURIComponent(user)}`);
      const data = await res.json();
      setRecipes(data);

      // Fetch rating summary for every recipe (fire-and-forget; we update state per result)
      data.forEach((r: RecipeFeedItem) => {
        fetchRating(r.recipe_id);
      });
    } catch (err) {
      console.error('fetchRecipes', err);
    }
  };

  // Add-recipe helpers
  const openAddIngredientPopup = () => {
    setPopupIngredient({
      name: '',
      calories: '',
      fats: '',
      carbs: '',
      sodium: '',
      sugar: '',
      protein: '0',
      cost: '0',
      quantity: '1',
    });
    setIsPopupOpen(true);
  };

  const handlePopupChange = (field: keyof Ingredient, value: string) => {
    setPopupIngredient(prev => ({ ...prev, [field]: value }));
  };

  const saveIngredient = () => {
    const fields = Object.values(popupIngredient);
    if (fields.some(f => f === '' || f === undefined)) {
      alert('All fields must be filled!');
      return;
    }
    setIngredients(prev => [...prev, { ...popupIngredient }]);
    setIsPopupOpen(false);
  };

  const handleSaveRecipe = async () => {
    if (!recipeName || ingredients.length === 0 || !instructions) {
      alert('Please complete all fields!');
      return;
    }
    const newRecipe = {
      name: recipeName,
      description: instructions,
      user_email: localStorage.getItem('email'),
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        quantity: Number(ing.quantity),
        calories: Number(ing.calories),
        fats: Number(ing.fats),
        carbs: Number(ing.carbs),
        sodium: Number(ing.sodium),
        sugar: Number(ing.sugar),
        protein: Number(ing.protein || 0),
        cost: Number(ing.cost || 0),
      })),
      visibility: 'public',
    };

    try {
      const response = await fetch('http://localhost:5000/api/recipes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });
      const data = await response.json();
      if (response.ok) {
        // clear form and refresh feed
        setRecipeName('');
        setIngredients([]);
        setInstructions('');
        fetchRecipes();
        // switch to feed tab optionally
        setActiveTab('feed');
      } else {
        console.error('Error saving recipe:', data);
        alert('Error saving recipe');
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('Error saving recipe');
    }
  };

  const deleteIngredient = (index: number) => {
    setIngredients(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  // Enter edit mode for a given ingredient index (in the Add Recipe screen)
  const enterIngredientEdit = (index: number) => {
    setEditingIndex(index);
    setEditingIngredient({ ...ingredients[index] });
  };

  // Update editingIngredient fields (safe immutable update)
  const onEditingFieldChange = (field: keyof Ingredient, value: string) => {
    setEditingIngredient(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  // Save edited ingredient back into ingredients list
  const saveEditedIngredient = () => {
    if (editingIndex === null || !editingIngredient) return;
    setIngredients(prev => {
      const copy = [...prev];
      copy[editingIndex] = { ...editingIngredient };
      return copy;
    });
    setEditingIndex(null);
    setEditingIngredient(null);
  };

  const cancelEditIngredient = () => {
    setEditingIndex(null);
    setEditingIngredient(null);
  };

  const calculateTotals = () => {
    const totals = { calories: 0, fats: 0, carbs: 0, sodium: 0, sugar: 0 };
    ingredients.forEach(ing => {
      totals.calories += Number(ing.calories || 0);
      totals.fats += Number(ing.fats || 0);
      totals.carbs += Number(ing.carbs || 0);
      totals.sodium += Number(ing.sodium || 0);
      totals.sugar += Number(ing.sugar || 0);
    });
    return totals;
  };

  // Dropdown selection (from existing ingredients)
  const handleDropdownIngredientClick = (ingredient: Ingredient) => {
    setSelectedDropdownIngredient(ingredient);
    setDropdownQuantity('');
    setIsQuantityPopupOpen(true);
    setIsDropdownOpen(false);
  };

  const saveDropdownIngredientWithQuantity = () => {
    if (!dropdownQuantity.trim()) {
      alert('Quantity is required');
      return;
    }
    if (!selectedDropdownIngredient) return;

    setIngredients(prev => [
      ...prev,
      {
        name: selectedDropdownIngredient.name,
        calories: selectedDropdownIngredient.calories || '0',
        fats: selectedDropdownIngredient.fats || '0',
        carbs: selectedDropdownIngredient.carbs || '0',
        sodium: selectedDropdownIngredient.sodium || '0',
        sugar: selectedDropdownIngredient.sugar || '0',
        protein: selectedDropdownIngredient.protein || '0',
        cost: selectedDropdownIngredient.cost || '0',
        quantity: dropdownQuantity,
      },
    ]);

    setIsQuantityPopupOpen(false);
    setSelectedDropdownIngredient(null);
    setDropdownQuantity('');
  };

  // Rating for feed
  const handleRate = async (recipe_id: number, value: number) => {
    try {
      await fetch('http://localhost:5000/api/recipes/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id, user_email: userEmail, rating: value }),
      });
      setRatingValue(prev => ({ ...prev, [recipe_id]: value }));
      // refresh rating summary for this recipe
      fetchRating(recipe_id);
    } catch (err) {
      console.error(err);
    }
  };

  const totals = calculateTotals();

  const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px' }}>
      {/* Tabs */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            ...buttonStyle,
            backgroundColor: activeTab === 'add' ? '#2e7d32' : '#4CAF50',
            marginRight: 8,
          }}
        >
          ➕ Add Recipe
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          style={{
            ...buttonStyle,
            backgroundColor: activeTab === 'feed' ? '#2e7d32' : '#7fbf7f',
          }}
        >
          📝 Recipes Feed
        </button>
      </div>

      {activeTab === 'add' && (
        <div style={{ backgroundColor: '#c9edb6', padding: '40px', borderRadius: '12px', color: '#4f4f4f' }}>
          <h1>Add New Recipe</h1>

          <input
            type="text"
            placeholder="Recipe Name"
            value={recipeName}
            onChange={e => setRecipeName(e.target.value)}
            style={inputStyle}
          />

          <div style={{ marginTop: 12 }}>
            <button onClick={openAddIngredientPopup} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>
              + Add New Ingredient
            </button>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>
              + Select Ingredient
            </button>
          </div>

          {isDropdownOpen && (
            <div style={{ marginTop: '10px', width: '100%' }}>
              <input
                type="text"
                placeholder="Search ingredients..."
                value={ingredientSearch}
                onChange={e => setIngredientSearch(e.target.value)}
                style={inputStyle}
              />
              <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {allIngredients
                  .filter(ing => ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()))
                  .map((ing, idx) => (
                    <div
                      key={idx}
                      style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                      onClick={() => handleDropdownIngredientClick(ing)}
                    >
                      {ing.name}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {isQuantityPopupOpen && (
            <div style={popupOverlayStyle}>
              <div style={popupContentStyle}>
                <h2>Enter Quantity (e.g. tbsp) for {selectedDropdownIngredient?.name}</h2>
                <input type="text" placeholder="Quantity" value={dropdownQuantity} onChange={e => setDropdownQuantity(e.target.value)} style={inputStyle} />
                <button onClick={saveDropdownIngredientWithQuantity} style={{ ...buttonStyle, backgroundColor: '#4CAF50', width: '100%' }}>
                  Save
                </button>
                <button onClick={() => setIsQuantityPopupOpen(false)} style={{ ...buttonStyle, backgroundColor: '#f44336', width: '100%' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Ingredients list */}
          <div style={{ marginTop: 20 }}>
            <h2>🧂 Ingredients</h2>
            {ingredients.length === 0 && <div style={{ color: '#666' }}>No ingredients yet</div>}
            {ingredients.map((ing, idx) => {
              const isEditing = editingIndex === idx;
              return (
                <div key={idx} style={{ backgroundColor: '#fff', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700 }}>
                      {ing.name} - {ing.quantity ?? ''}
                    </div>
                    <div>
                      {isEditing ? (
                        <>
                          <button onClick={saveEditedIngredient} style={{ ...buttonStyle, backgroundColor: '#2e7d32', fontSize: 12 }}>
                            Save
                          </button>
                          <button onClick={cancelEditIngredient} style={{ ...buttonStyle, backgroundColor: '#f44336', fontSize: 12 }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => enterIngredientEdit(idx)} style={{ ...buttonStyle, backgroundColor: '#81c784', fontSize: 12 }}>
                            Edit
                          </button>
                          <button onClick={() => deleteIngredient(idx)} style={{ ...buttonStyle, backgroundColor: '#f44336', fontSize: 12 }}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Display: text-only unless editing */}
                  {isEditing ? (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <label>Calories:</label>
                        <input
                          type="text"
                          value={editingIngredient?.calories ?? ''}
                          onChange={e => onEditingFieldChange('calories', e.target.value)}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid #333', width: 100 }}
                        />
                        <label>Fats:</label>
                        <input
                          type="text"
                          value={editingIngredient?.fats ?? ''}
                          onChange={e => onEditingFieldChange('fats', e.target.value)}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid #333', width: 100 }}
                        />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <label>Carbs:</label>{' '}
                        <input
                          type="text"
                          value={editingIngredient?.carbs ?? ''}
                          onChange={e => onEditingFieldChange('carbs', e.target.value)}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid #333', width: 100 }}
                        />{' '}
                        <label style={{ marginLeft: 10 }}>Sodium:</label>{' '}
                        <input
                          type="text"
                          value={editingIngredient?.sodium ?? ''}
                          onChange={e => onEditingFieldChange('sodium', e.target.value)}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid #333', width: 100 }}
                        />{' '}
                        <label style={{ marginLeft: 10 }}>Sugar:</label>{' '}
                        <input
                          type="text"
                          value={editingIngredient?.sugar ?? ''}
                          onChange={e => onEditingFieldChange('sugar', e.target.value)}
                          style={{ padding: 6, borderRadius: 6, border: '1px solid #333', width: 100 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 14, color: '#555' }}>
                        Calories: <strong>{ing.calories}</strong> &nbsp; | &nbsp; Fats: <strong>{ing.fats}</strong>
                      </div>
                      <div style={{ marginTop: 6, color: '#555' }}>
                        Carbs: {ing.carbs || 0} | Sodium: {ing.sodium || 0} | Sugar: {ing.sugar || 0}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ marginTop: 10 }}>
              <strong>Total:</strong> {totals.calories} kcal | {totals.fats}g fats | {totals.carbs}g carbs | {totals.sodium}mg sodium | {totals.sugar}g sugar
            </div>
          </div>

          <h3 style={{ marginTop: 20 }}>Description:</h3>
          <textarea placeholder="Write recipe description here..." value={instructions} onChange={e => setInstructions(e.target.value)} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />

          <div style={{ marginTop: 12 }}>
            <button onClick={handleSaveRecipe} style={{ ...buttonStyle, backgroundColor: '#81c784' }}>
              Save Recipe
            </button>
          </div>

          {/* Add ingredient popup */}
          {isPopupOpen && (
            <div style={popupOverlayStyle}>
              <div style={popupContentStyle}>
                <h2>Add Ingredient</h2>
                {['name', 'calories', 'fats', 'carbs', 'sodium', 'sugar', 'protein', 'cost', 'quantity'].map(field => (
                  <div key={field} style={{ marginBottom: '10px' }}>
                    <label style={{ fontWeight: 'bold', color: '#555' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type="text"
                      placeholder={field}
                      value={(popupIngredient as any)[field] ?? ''}
                      onChange={e => handlePopupChange(field as keyof Ingredient, e.target.value)}
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
      )}

      {activeTab === 'feed' && (
        <div style={{ backgroundColor: '#c9edb6', padding: '30px', borderRadius: '12px', color: '#4f4f4f' }}>
          <h1>🍲 Recipes Feed</h1>
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #a2a2a2', backgroundColor: '#a2a2a2', color: 'white' }}
          />

          {filteredRecipes.map(recipe => (
            <div key={recipe.recipe_id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '15px', marginBottom: '15px' }}>
              <h2 style={{ color: '#4CAF50' }}>{recipe.name}</h2>
              <p>{recipe.description}</p>
              <div>
                <strong>Ingredients:</strong> {recipe.ingredients.map(i => `${i.quantity} of ${i.name}`).join(', ')}
              </div>

              {/* Rating UI */}
              <div style={{ marginTop: 8 }}>
                <strong>Rate:</strong>
                {[1, 2, 3, 4, 5].map(num => (
                  <span
                    key={num}
                    style={{ cursor: 'pointer', color: (ratingValue[recipe.recipe_id] || 0) >= num ? 'gold' : '#ccc', fontSize: '20px', marginLeft: '5px' }}
                    onClick={() => handleRate(recipe.recipe_id, num)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Average + count display */}
              <div style={{ marginTop: 8, fontSize: 14, color: '#333', display: 'flex', gap: 12, alignItems: 'center' }}>
                {ratingsSummary[recipe.recipe_id] ? (
                  <>
                    <div>
                      Average: <strong>{Number(ratingsSummary[recipe.recipe_id].avg_rating).toFixed(1)} ★</strong>
                    </div>
                    <div>
                      <span>⭐</span> <strong>{ratingsSummary[recipe.recipe_id].total_ratings}</strong> ratings
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#666' }}>No ratings yet</div>
                )}
              </div>

              <div style={{ fontSize: '12px', color: '#888', marginTop: 8 }}>
                Posted by: {recipe.user_email} | {new Date(recipe.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
