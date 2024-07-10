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
          <tr v-for="lot in lots" :key="lot.lote_id">
            <td>{{ lot.pasto_id }}</td>
            <td>{{ lot.lote_id }}</td>
            <td>{{ lot.nome }}</td>
            <td>
              <button @click="editLot(lot)">Editar</button>
              <button @click="deleteLot(lot.lote_id)">Excluir</button>
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
          <label for="pasto_id">Pasto ID:</label>
          <input type="number" v-model="form.pasto_id" required />

          <label for="nome">Nome:</label>
          <input type="text" v-model="form.nome" required />

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
        pasto_id: '',
        nome: ''
      }
    };
  },
  methods: {
    openAddModal() {
      this.isEditMode = false;
      this.errorMessage = '';
      this.form = {
        pasto_id: '',
        nome: ''
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    editLot(lot) {
      this.isEditMode = true;
      this.errorMessage = '';
      this.form = { ...lot };
      this.showModal = true;
    },
    async saveLot() {
      const pastureExists = this.pastures.some(pasture => pasture.pasto_id === this.form.pasto_id);
      if (!pastureExists) {
        this.errorMessage = 'O Pasto ID fornecido não está cadastrado em Pastagens.';
        return;
      }

      const method = this.isEditMode ? 'PUT' : 'POST';
      const url = this.isEditMode
        ? `http://localhost:8000/herds/${this.form.lote_id}`
        : 'http://localhost:8000/herds';

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
          const index = this.lots.findIndex(l => l.lote_id === this.form.lote_id);
          if (index !== -1) {
            this.lots.splice(index, 1, data);
          }
        } else {
          this.lots.push(data);
        }

        this.closeModal();
        this.fetchLots(); // Fetch updated lots list
      } catch (error) {
        console.error('Failed to save lot:', error);
      }
    },
    async deleteLot(lote_id) {
      try {
        const response = await fetch(`http://localhost:8000/herds/${lote_id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        this.lots = this.lots.filter(l => l.lote_id !== lote_id);
      } catch (error) {
        console.error('Failed to delete lot:', error);
      }
    },
    async fetchLots() {
      try {
        const response = await fetch('http://localhost:8000/list_herd');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.lots = data;
      } catch (error) {
        console.error('Failed to fetch lots:', error);
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