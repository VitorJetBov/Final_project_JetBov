<template>
  <div class="animal-projection">
    <Navbar />
    <div class="content">
      <h1>Projeção Animal</h1>
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
            <td>{{ projection.lote_id }}</td>
            <td>{{ projection.gmd }}</td>
            <td>{{ projection.ganho }}</td>
            <td>{{ projection.dia }}</td>
          </tr>
        </tbody>
      </table>
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
      const response = await fetch('http://localhost:8000/animal_projection');
      const data = await response.json();
      this.projections = data;
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
}

.content {
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  width: 60%;
  margin: auto;
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
