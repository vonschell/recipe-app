import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });

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
      }
    };
    fetchAllRecipes();
  }, []);

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

      if (response.ok) {
        const date = await response.json();
        setRecipes([...recipes, date.recipe]);

        console.log("recipe added successfully");

        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
      } else {
        console.error("Failed to add recipe");
      }
    } catch (e) {
      console.error("Error adding recipe:", e);
    }
  };  

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

  return (
    <div className="recipe-app">
      <Header showRecipeForm={showRecipeForm}/>
      
      {showNewRecipeForm && (
        <NewRecipeForm
          newRecipe={newRecipe}
          hideRecipeForm={hideRecipeForm}
          onUpdateForm={onUpdateForm}
          handleNewRecipe={handleNewRecipe} 
        />
      )}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} />}
      {!selectedRecipe && !showNewRecipeForm && (
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
