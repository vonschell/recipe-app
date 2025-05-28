import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          console.log("Failed to fetch recipes");
        }
      } catch (e) {
        console.error("Error fetching recipes:", e);
        console.log("An error occurred while fetching recipes. Please try again later.");
      }
    };
    fetchAllRecipes();
  }, []);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  };

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  };

  const onUpdateForm = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });

  return (
    <div className="recipe-app">
      <Header showRecipeForm={showRecipeForm}/>
      
      {showNewRecipeForm && (
        <NewRecipeForm
          newRecipe={newRecipe}
          setNewRecipe={setNewRecipe}
          hideRecipeForm={hideRecipeForm}
          onUpdateForm={onUpdateForm}
        />
      )}
      {selectedRecipe ? (
        <RecipeFull
          selectedRecipe={selectedRecipe}
          handleUnselectRecipe={handleUnselectRecipe}
        />
      ) : (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeExcerpt
              key={recipe.id}
              recipe={recipe}
              handleSelelctRecipe={handleSelectRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
