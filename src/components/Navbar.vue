<template>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/pastures">Lista Pastagem</router-link>
      <router-link to="/animals">Lista Animais</router-link>
      <router-link to="/lots">Lista Lotes</router-link>
      <router-link to="/rotation">Projeção Pasto</router-link>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  }
  </script>
  
  <style scoped>
  nav {
    width: 100%;
    background-color: #4CAF50;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
  }
  
  a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    transition: color 0.3s;
  }
  
  a:hover {
    color: #ddd;
  }
  </style>
  