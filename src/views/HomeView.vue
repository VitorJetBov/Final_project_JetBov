<template>
    <div class="home">
      <div class="buttons">
        <router-link to="/pastures">
          <button>Lista Pastagem</button>
        </router-link>
        <router-link to="/animals">
          <button>Lista Animais</button>
        </router-link>
        <router-link to="/lots">
          <button>Lista Lotes</button>
        </router-link>
        <router-link to="/rotation">
          <button>Projeção Pasto</button>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  }
  </script>
  
  <style scoped>
  .home {
    background-image: url('@/assets/Tela_inicial.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }
  
  .buttons {
    display: flex;
    flex-direction: column;
    padding: 120px;
  }
  
  button {
    background-color: green;
    color: white;
    border: none;
    padding: 15px 20px;
    font-size: 17px;
    cursor: pointer;
    margin: 5px 0;
    border-radius: 5px;
    text-transform: uppercase;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;
    width: 200px; 
  }
  
  button:hover {
    background-color: darkgreen;
    transform: scale(1.05);
  }
  </style>
  