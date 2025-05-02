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

  // Fetch ingredients from API
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

  // Fetch saved recipes from API
  useEffect(() => {
    fetchRecipes();
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

  const handleSaveRecipe = async () => {
    if (!recipeName || ingredients.length === 0 || !instructions) {
      alert('Please complete all fields!');
      return;
    }
    const newRecipe = {
      name: recipeName,
      description: instructions, 
      ingredients,
      user_email:localStorage.getItem('email'),
    };
    console.log('Ingredients being sent:', ingredients);

    try {
      const response = await fetch('http://localhost:5000/api/recipes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
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
    setPopupIngredient(ingredients[index]);
    deleteIngredient(index);
    setIsPopupOpen(true);
  };

  const calculateTotals = () => {
    const totals = {
      calories: 0,
      fats: 0,
      carbs: 0,
      sodium: 0,
      sugar: 0,
    };
  
    ingredients.forEach(ingredient => {
      totals.calories += parseFloat(ingredient.calories || '0');
      totals.fats += parseFloat(ingredient.fats || '0');
      totals.carbs += parseFloat(ingredient.carbs || '0');
      totals.sodium += parseFloat(ingredient.sodium || '0');
      totals.sugar += parseFloat(ingredient.sugar || '0');
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
                    const selectedIngredient = {
                      ...ingredient,
                      quantity: ingredient.quantity || '1', // Set default quantity to '1' 
                    };
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
                  {Array.isArray(recipe.ingredients) &&
                    recipe.ingredients.map((ing: any, idx: number) => (
                      <li key={idx}>{ing.quantity} of {ing.name}</li>
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
*/

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
  overflowX: 'hidden',
};
type Ingredient = {
  name: string;
  quantity: string;
  calories: string;
  fats: string;
  carbs: string;
  sodium: string;
  sugar: string;
};


export default function AddRecipePage() {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [instructions, setInstructions] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupIngredient, setPopupIngredient] = useState<Ingredient>({
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
  const [selectedDropdownIngredient, setSelectedDropdownIngredient] = useState<any | null>(null);
  const [isQuantityPopupOpen, setIsQuantityPopupOpen] = useState(false);
  const [dropdownQuantity, setDropdownQuantity] = useState('');

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

  const handlePopupChange = (field: keyof Ingredient, value: string) => {
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

  const handleSaveRecipe = async () => {
    if (!recipeName || ingredients.length === 0 || !instructions) {
      alert('Please complete all fields!');
      return;
    }
    const newRecipe = {
      name: recipeName,
      description: instructions,
      ingredients,
      user_email: localStorage.getItem('email'),
    };

    try {
      const response = await fetch('http://localhost:5000/api/recipes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
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
    setPopupIngredient(ingredients[index]);
    deleteIngredient(index);
    setIsPopupOpen(true);
  };

  const calculateTotals = () => {
    const totals = {
      calories: 0,
      fats: 0,
      carbs: 0,
      sodium: 0,
      sugar: 0,
    };

    ingredients.forEach(ingredient => {
      totals.calories += parseFloat(ingredient.calories || '0');
      totals.fats += parseFloat(ingredient.fats || '0');
      totals.carbs += parseFloat(ingredient.carbs || '0');
      totals.sodium += parseFloat(ingredient.sodium || '0');
      totals.sugar += parseFloat(ingredient.sugar || '0');
    });

    return totals;
  };

  const handleDropdownIngredientClick = (ingredient: any) => {
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

    setIngredients([...ingredients, {
      ...selectedDropdownIngredient,
      quantity: dropdownQuantity,
    }]);

    setIsQuantityPopupOpen(false);
    setSelectedDropdownIngredient(null);
    setDropdownQuantity('');
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
            onChange={(e) => setIngredientSearch(e.target.value)}
            style={inputStyle}
          />
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {allIngredients
              .filter((ingredient) => ingredient.name.toLowerCase().includes(ingredientSearch.toLowerCase()))
              .map((ingredient, index) => (
                <div
                  key={index}
                  onClick={() => handleDropdownIngredientClick(ingredient)}
                  style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  {ingredient.name}
                </div>
              ))}
          </div>
        </div>
      )}

      {isQuantityPopupOpen && (
        <div style={popupOverlayStyle}>
          <div style={popupContentStyle}>
            <h2>Enter Quantity (tbsp) for {selectedDropdownIngredient?.name}</h2>
            <input
              type="text"
              placeholder="Quantity"
              value={dropdownQuantity}
              onChange={(e) => setDropdownQuantity(e.target.value)}
              style={inputStyle}
            />
            <button onClick={saveDropdownIngredientWithQuantity} style={{ ...buttonStyle, backgroundColor: '#4CAF50', width: '100%' }}>
              Save
            </button>
            <button onClick={() => setIsQuantityPopupOpen(false)} style={{ ...buttonStyle, backgroundColor: '#f44336', width: '100%' }}>
              Cancel
            </button>
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
                    {Array.isArray(recipe.ingredients) &&
                      recipe.ingredients.map((ing: any, idx: number) => (
                        <li key={idx}>{ing.quantity} of {ing.name}</li>
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
            {['name', 'quantity (tbsp) ', 'calories', 'fats', 'carbs', 'sodium', 'sugar'].map((field) => (
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