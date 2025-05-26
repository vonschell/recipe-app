import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  
  return (
    <div className='recipe-app'>
      <Header />
      <p>Your recipes here! </p>
    </div>
  );
}

export default App;
