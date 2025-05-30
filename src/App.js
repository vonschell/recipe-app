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
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url:
      "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // default
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
          "content-type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes([...recipes, data.recipe]);

        console.log("Recipe added successfully");

        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url:
            "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        });
      } else {
        console.error("Failed to add recipe");
      }
    } catch (e) {
      console.error("Error adding recipe:", e);
    }
  };

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();
    const { id } = selectedRecipe;
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(selectedRecipe),
      });
      if (response.ok) {
        const data = await response.json();
        setRecipes(
          recipes.map((recipe) =>
            recipe.id === id ? data.recipe : recipe
          )
        );
        console.log("Recipe updated successfully");
      } else {
        console.error("Failed to update recipe");
      }
    } catch (error) {
      console.error("Error updating recipe. Try again please.");
    }
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        setSelectedRecipe(null);
        console.log("Recipe deleted successfully");
      } else {
        console.error("Failed to delete recipe", e);
      } 
    } catch (e) {
        console.error("Error deleting recipe:", e);
        console.error("Failed to update recipe. Please try again.");
    }
  }; 

  const handleSearch = () => {
    const searchResults = recipes.filter((recipe) => {
      const valuesToSerach = [recipe.title, recipe.ingredients, recipe.description];
      return valuesToSerach.some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return searchResults;
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

  const updateSearchTerm = (text) => {
    setSearchTerm(text);
  };

  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    } else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  return (
    <div className="recipe-app">
      <Header showRecipeForm={showRecipeForm} updateSearchTerm={updateSearchTerm} searchTerm={searchTerm}/>

      {showNewRecipeForm && (
        <NewRecipeForm
          newRecipe={newRecipe}
          hideRecipeForm={hideRecipeForm}
          onUpdateForm={onUpdateForm}
          handleNewRecipe={handleNewRecipe}
        />
      )}
      {selectedRecipe && (
        <RecipeFull
          selectedRecipe={selectedRecipe}
          handleUnselectRecipe={handleUnselectRecipe}
          handleUpdateRecipe={handleUpdateRecipe}
          handleDeleteRecipe={handleDeleteRecipe}
          onUpdateForm={onUpdateForm}
        />
      )}
      {!selectedRecipe && !showNewRecipeForm && (
        <div className="recipe-list">
          {displayedRecipes.map((recipe) => (
            <RecipeExcerpt
              key={recipe.id}
              recipe={recipe}
              handleSelectRecipe={handleSelectRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
