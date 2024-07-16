<template>
  <div class="rotation">
    <Navbar />
    <div class="content">
      <h1>Projeção de Rotação</h1>
      <form @submit.prevent="startProjection">
        <label for="days">Dias de Rotação:</label>
        <input type="number" v-model="days" id="days" required />
        <button type="submit">Iniciar</button>
      </form>
      <button @click="navigateToAnimalProjection">Projeção Animal</button>
      <div class="table-container">
        <table v-if="rotations && rotations.length">
          <thead>
            <tr>
              <th>Dia</th>
              <th>Pasto ID</th>
              <th>Lote ID</th>
              <th>Forragem Disponível</th>
              <th>% Forragem Disponível</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rotation in rotations" :key="rotation.day">
              <td>{{ rotation.day }}</td>
              <td>{{ rotation.pasture_id }}</td>
              <td>{{ rotation.herd_id }}</td>
              <td>{{ rotation.available_hay }}</td>
              <td>{{ rotation.perc_available_hay }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'RotationView',
  components: { Navbar },
  data() {
    return {
      days: '',
      rotations: []
    };
  },
  methods: {
    async startProjection() {
      try {
        const response = await fetch(`http://192.168.15.46:8000/start_projection/${this.days}`);
        if (response.ok) {
          this.fetchRotations();
        } else {
          console.error('Failed to start projection:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to start projection:', error);
      }
    },
    async fetchRotations() {
      try {
        const response = await fetch(`http://192.168.15.46:8000/pasture_projection`);
        const data = await response.json();
        this.rotations = data;
      } catch (error) {
        console.error('Failed to fetch rotations:', error);
        this.rotations = [];
      }
    },
    navigateToAnimalProjection() {
      this.$router.push({ name: 'AnimalProjectionView' });
    }
  }
};
</script>

<style scoped>
.rotation {
  background-image: url('@/assets/tela_secundaria.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden; /* Fix the background and other content */
}

.content {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  width: 60%;
}

form {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

input {
  margin-right: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  background-color: green;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin: 2px;
  border-radius: 3px;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: darkgreen;
  transform: scale(1.05);
}

.table-container {
  height: 60vh; /* Set the desired height for the table container */
  overflow-y: auto; /* Enable vertical scrolling */
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4CAF50;
  color: white;
}

p {
  margin-top: 20px;
  color: red;
  font-weight: bold;
}
</style>
