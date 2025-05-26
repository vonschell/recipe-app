import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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

  return (
    <div className='recipe-app'>
      <Header />
      <div className='recipe-list'>
        {recipes.map((recipe) => (
          <RecipeExcerpt key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default App;
