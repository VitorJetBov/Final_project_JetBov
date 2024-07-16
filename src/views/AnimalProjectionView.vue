<template>
  <div class="animal-projection">
    <Navbar />
    <div class="content">
      <h1>Projeção Animal</h1>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>RFID</th>
              <th>Lote ID</th>
              <th>GMD</th>
              <th>Ganho (kg)</th>
              <th>Dia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="projection in projections" :key="projection.id">
              <td>{{ projection.rfid }}</td>
              <td>{{ projection.herd_id }}</td>
              <td>{{ projection.gmd }}</td>
              <td>{{ projection.kg_gain }}</td>
              <td>{{ projection.day }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'AnimalProjectionView',
  components: { Navbar },
  data() {
    return {
      projections: [],
    };
  },
  methods: {
    async fetchProjections() {
      try {
        const response = await fetch('http://192.168.15.46:8000/animal_projection/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.projections = data;
      } catch (error) {
        console.error('Failed to fetch projections:', error);
      }
    },
  },
  created() {
    this.fetchProjections();
  },
};
</script>

<style scoped>
.animal-projection {
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
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  width: 60%;
}

.table-container {
  height: 60vh; 
  overflow-y: auto; 
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
</style>
