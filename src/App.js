import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import { ToastContainer } from "react-toastify";
import displayToast from "./helpers/toastHelper"; 
import "react-toastify/dist/ReactToastify.css";
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
          displayToast("Failed to fetch recipes", "error");
        }
      } catch (e) {
        displayToast("Error fetching recipes:", "error");
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

        displayToast("Recipe added successfully", "success");

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
        displayToast("Failed to add recipe", "error");
      }
    } catch (e) {
      displayToast("Error adding recipe:", "error");
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
        displayToast("Recipe updated successfully" , "success");
      } else {
        displayToast("Failed to update recipe", "error");
      }
    } catch (error) {
      displayToast("Error updating recipe. Try again please.", "error");
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
        displayToast("Recipe deleted successfully", "success");
      } else {
        displayToast("Failed to delete recipe", "error");
      } 
    } catch (e) {
      displayToast("Error deleting recipe:", "error");
      displayToast("Failed to update recipe. Please try again.", "error");
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

  const displayAllRecipes = () => {
    hideRecipeForm();
    handleUnselectRecipe();
    updateSearchTerm("");
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  return (
    <div className="recipe-app">
      <Header showRecipeForm={showRecipeForm} updateSearchTerm={updateSearchTerm} handleSearch={handleSearch} searchTerm={searchTerm} displayAllRecipes={displayAllRecipes}/>

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
      <ToastContainer />
    </div>
  );
}

export default App;
