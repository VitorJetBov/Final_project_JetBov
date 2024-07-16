<template>
  <div class="lots">
    <Navbar />
    <div class="content">
      <h1>Lista de Lotes</h1>
      <button @click="openAddModal">Adicionar Lote</button>
      <table>
        <thead>
          <tr>
            <th>Pasto ID</th>
            <th>Lote ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lot in lots" :key="lot.herd_id">
            <td>{{ lot.pasture_id }}</td>
            <td>{{ lot.herd_id }}</td>
            <td>{{ lot.name }}</td>
            <td>
              <button @click="editLot(lot)">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ isEditMode ? 'Editar Lote' : 'Adicionar Lote' }}</h2>
        <form @submit.prevent="saveLot">
          <label for="pasture_id">Pasto ID:</label>
          <input type="number" v-model="form.pasture_id" required />

          <label for="name">Nome:</label>
          <input type="text" v-model="form.name" required />

          <button type="submit">{{ isEditMode ? 'Salvar' : 'Adicionar' }}</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'LotsView',
  components: { Navbar },
  data() {
    return {
      lots: [],
      pastures: [],
      showModal: false,
      isEditMode: false,
      errorMessage: '',
      form: {
        pasture_id: '',
        name: '',
        herd_id: null 
      }
    };
  },
  methods: {
    openAddModal() {
      this.isEditMode = false;
      this.errorMessage = '';
      this.form = {
        pasture_id: '',
        name: '',
        herd_id: null
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    editLot(lot) {
      this.isEditMode = true;
      this.errorMessage = '';
      this.form = { pasture_id: lot.pasture_id, name: lot.name, herd_id: lot.herd_id };
      this.showModal = true;
    },
    async saveLot() {
      const pastureExists = this.pastures.some(pasture => pasture.pasture_id === this.form.pasture_id);
      if (!pastureExists) {
        this.errorMessage = 'O Pasto ID fornecido não está cadastrado.';
        return;
      }
      if (!this.isEditMode) {
        const duplicateLot = this.lots.find(l => l.herd_id === this.form.herd_id);
        if (duplicateLot) {
          this.errorMessage = 'Lote ID já existe. Escolha outro Lote ID.';
          return;
        }
      }

      const method = this.isEditMode ? 'PUT' : 'POST';
      const url = this.isEditMode
        ? `http://192.168.15.46:8000/update_herd/${this.form.herd_id}`
        : 'http://192.168.15.46:8000/create_herd';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pasture_id: this.form.pasture_id, name: this.form.name })
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.errorMessage = `Failed to save lot: ${errorData.detail || response.statusText}`;
        return;
      }

      const data = await response.json();

      if (this.isEditMode) {
        const index = this.lots.findIndex(l => l.herd_id === data.herd_id);
        if (index !== -1) {
          this.lots.splice(index, 1, data);
        }
      } else {
        this.lots.push(data);
      }

      this.closeModal();
      this.fetchLots(); 
    },
    async deleteLot(herd_id) {
      const response = await fetch(`http://192.168.15.46:8000/delete_herd/${herd_id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.errorMessage = `Failed to delete lot: ${errorData.detail || response.statusText}`;
        return;
      }

      this.lots = this.lots.filter(l => l.herd_id !== herd_id);
    },
    async fetchLots() {
      const response = await fetch('http://192.168.15.46:8000/list_herd');
      const data = await response.json();
      this.lots = data;
    },
    async fetchPastures() {
      const response = await fetch('http://192.168.15.46:8000/list_pasture');
      const data = await response.json();
      this.pastures = data;
    }
  },
  created() {
    this.fetchLots();
    this.fetchPastures();
  }
};
</script>

<style scoped>
.lots {
  background-image: url('@/assets/tela_secundaria.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error {
  color: red;
  margin-top: 10px;
}

.content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 80%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #4CAF50;
  color: white;
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: left;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-top: 10px;
}

form input {
  padding: 5px;
  margin-top: 5px;
  border-radius: 3px;
  border: 1px solid #ddd;
}

form button {
  background-color: green;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

form button:hover {
  background-color: darkgreen;
}
</style>
