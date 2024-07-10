<template>
  <div class="rotation">
    <Navbar />
    <div class="content">
      <h1>Projeção Pasto</h1>
      <div class="rotation-input">
        <label for="rotation-days">Dias de rotação:</label>
        <input type="number" v-model="rotationDays" id="rotation-days" />
        <button @click="startRotation">Iniciar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Pasto ID</th>
            <th>Lote ID</th>
            <th>Forragem Atual</th>
            <th>Dia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rotation in rotations" :key="rotation.id">
            <td>{{ rotation.pasto_id }}</td>
            <td>{{ rotation.lote_id }}</td>
            <td>{{ rotation.forragem_atual }}</td>
            <td>{{ rotation.dia }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="navigateToAnimalProjection">Projeção Animal</button>
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
      rotations: [],
      rotationDays: 0,
    };
  },
  methods: {
    async startRotation() {
      const response = await fetch(`http://localhost:8000/start_projection/${this.rotationDays}`);
      const data = await response.json();
      this.rotations = data;
    },
    navigateToAnimalProjection() {
      this.$router.push({ name: 'AnimalProjectionView' });
    },
  },
  created() {
    // Fetch initial data if needed
  },
};
</script>

<style scoped>
.rotation {
  background-image: url('@/assets/tela_secundaria.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
}

.content {
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  width: 60%;
  margin: auto;
}

.rotation-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

button {
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
  margin-top: 10px;
}

button:hover {
  background-color: darkgreen;
  transform: scale(1.05);
}
</style>
