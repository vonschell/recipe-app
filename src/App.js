import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);

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

  return (
    <div className='recipe-app'>
      <Header />
      <p>Your recipes here! </p>
      {JSON.stringify(recipes)}
    </div>
  );
}

export default App;
