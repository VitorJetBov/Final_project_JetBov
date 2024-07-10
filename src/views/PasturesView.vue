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
          <tr v-for="pasture in pastures" :key="pasture.pasto_id">
            <td>{{ pasture.pasto_id }}</td>
            <td>{{ pasture.recuperacao }}</td>
            <td>{{ pasture.forragem_atual }}</td>
            <td>{{ pasture.forragem_total }}</td>
            <td>{{ pasture.capacidade_maxima }}</td>
            <td>
              <button @click="editPasture(pasture)">Editar</button>
              <button @click="deletePasture(pasture.pasto_id)">Excluir</button>
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
          <label for="recuperacao">Recuperação (dias):</label>
          <input type="number" v-model="form.recuperacao" required />

          <label for="forragem_atual">Forragem Atual:</label>
          <input type="number" v-model="form.forragem_atual" required />

          <label for="forragem_total">Forragem Total:</label>
          <input type="number" v-model="form.forragem_total" required />

          <label for="capacidade_maxima">Capacidade Máxima:</label>
          <input type="number" v-model="form.capacidade_maxima" required />

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
        recuperacao: '',
        forragem_atual: '',
        forragem_total: '',
        capacidade_maxima: ''
      }
    };
  },
  methods: {
    openAddModal() {
      this.isEditMode = false;
      this.errorMessage = '';
      this.form = {
        recuperacao: '',
        forragem_atual: '',
        forragem_total: '',
        capacidade_maxima: ''
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
        ? `http://localhost:8000/pastures/${this.form.pasto_id}`
        : 'http://localhost:8000/pastures';

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (this.isEditMode) {
          const index = this.pastures.findIndex(p => p.pasto_id === this.form.pasto_id);
          if (index !== -1) {
            this.pastures.splice(index, 1, data);
          }
        } else {
          this.pastures.push(data);
        }

        this.closeModal();
        this.fetchPastures(); // Fetch updated pastures list
      } catch (error) {
        console.error('Failed to save pasture:', error);
      }
    },
    async deletePasture(pasto_id) {
      try {
        const response = await fetch(`http://localhost:8000/pastures/${pasto_id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        this.pastures = this.pastures.filter(p => p.pasto_id !== pasto_id);
      } catch (error) {
        console.error('Failed to delete pasture:', error);
      }
    },
    async fetchPastures() {
      try {
        const response = await fetch('http://localhost:8000/list_pasture');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.pastures = data;
      } catch (error) {
        console.error('Failed to fetch pastures:', error);
      }
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

close:hover,
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
