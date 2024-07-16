<template>
  <div class="pastures">
    <Navbar />
    <div class="content">
      <h1>Lista de Pastagens</h1>
      <button @click="openAddModal">Adicionar Pastagem</button>
      <table>
        <thead>
          <tr>
            <th>Pasto ID</th>
            <th>Recuperação (dias)</th>
            <th>Forragem Atual</th>
            <th>Forragem Total</th>
            <th>Capacidade Máxima</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pasture in pastures" :key="pasture?.pasture_id">
            <td>{{ pasture?.pasture_id }}</td>
            <td>{{ pasture?.recovery_days }}</td>
            <td>{{ pasture?.available_hay }}</td>
            <td>{{ pasture?.total_hay }}</td>
            <td>{{ pasture?.animal_quantity }}</td>
            <td>
              <button @click="editPasture(pasture)">Editar</button>
              <button @click="deletePasture(pasture?.pasture_id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ isEditMode ? 'Editar Pastagem' : 'Adicionar Pastagem' }}</h2>
        <form @submit.prevent="savePasture">
          <label for="recovery_days">Recuperação (dias):</label>
          <input type="number" v-model="form.recovery_days" required />

          <label for="available_hay">Forragem Atual:</label>
          <input type="number" v-model="form.available_hay" required />

          <label for="total_hay">Forragem Total:</label>
          <input type="number" v-model="form.total_hay" required />

          <label for="animal_quantity">Capacidade Máxima:</label>
          <input type="number" v-model="form.animal_quantity" required />

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
  name: 'PasturesView',
  components: { Navbar },
  data() {
    return {
      pastures: [],
      showModal: false,
      isEditMode: false,
      errorMessage: '',
      form: {
        recovery_days: '',
        available_hay: '',
        total_hay: '',
        animal_quantity: ''
      }
    };
  },
  methods: {
    openAddModal() {
      this.isEditMode = false;
      this.errorMessage = '';
      this.form = {
        recovery_days: '',
        available_hay: '',
        total_hay: '',
        animal_quantity: ''
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    editPasture(pasture) {
      this.isEditMode = true;
      this.errorMessage = '';
      this.form = { ...pasture };
      this.showModal = true;
    },
    async savePasture() {
      const method = this.isEditMode ? 'PUT' : 'POST';
      const url = this.isEditMode
        ? `http://192.168.15.46:8000/update_pasture/${this.form.pasture_id}`
        : 'http://192.168.15.46:8000/create_pasture';

      const pastureData = {
        recovery_days: this.form.recovery_days,
        available_hay: this.form.available_hay,
        total_hay: this.form.total_hay,
        animal_quantity: this.form.animal_quantity
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pastureData)
      });

      const data = await response.json();

      if (this.isEditMode) {
        const index = this.pastures.findIndex(p => p.pasture_id === this.form.pasture_id);
        if (index !== -1) {
          this.pastures.splice(index, 1, data);
        }
      } else {
        this.pastures.push(data);
      }

      this.closeModal();
      this.fetchPastures(); 
    },
    async deletePasture(pasture_id) {
      await fetch(`http://192.168.15.46:8000/delete_pasture/${pasture_id}`, {
        method: 'DELETE'
      });

      this.pastures = this.pastures.filter(p => p.pasture_id !== pasture_id);
    },
    async fetchPastures() {
      console.log('chamando')
      const response = await fetch('http://192.168.15.46:8000/list_pasture', { headers: { 'Accept': 'application/json' } });
      console.log(response)
      const data = await response.json();
      this.pastures = data;
    }
  },

  created() {
    this.fetchPastures();

  }
};
</script>

<style scoped>
.pastures {
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

/* Modal styling */
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
