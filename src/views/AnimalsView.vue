<template>
  <div class="animals">
    <Navbar />
    <div class="content">
      <h1>Lista de Animais</h1>
      <button @click="openAddModal">Adicionar Animal</button>
      <table>
        <thead>
          <tr>
            <th>RFID</th>
            <th>Peso de Entrada</th>
            <th>Peso Atual</th>
            <th>Idade (meses)</th>
            <th>Necessidade Nutricional</th>
            <th>Lote ID</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animal in animals" :key="animal.rfid">
            <td>{{ animal.rfid }}</td>
            <td>{{ animal.peso_entrada }}</td>
            <td>{{ animal.peso_atual }}</td>
            <td>{{ animal.idade }}</td>
            <td>{{ animal.necessidade_nutricional }}</td>
            <td>{{ animal.lote_id }}</td>
            <td>
              <button @click="editAnimal(animal)">Editar</button>
              <button @click="deleteAnimal(animal.rfid)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ isEditMode ? 'Editar Animal' : 'Adicionar Animal' }}</h2>
        <form @submit.prevent="saveAnimal">
          <label for="peso_entrada">Peso de Entrada:</label>
          <input type="number" v-model="form.peso_entrada" required />

          <label for="peso_atual">Peso Atual:</label>
          <input type="number" v-model="form.peso_atual" required />

          <label for="idade">Idade (meses):</label>
          <input type="number" v-model="form.idade" required />

          <label for="necessidade_nutricional">Necessidade Nutricional:</label>
          <input type="number" v-model="form.necessidade_nutricional" required />

          <label for="lote_id">Lote ID:</label>
          <input type="number" v-model="form.lote_id" required />

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
  name: 'AnimalsView',
  components: { Navbar },
  data() {
    return {
      animals: [],
      lots: [],
      showModal: false,
      isEditMode: false,
      errorMessage: '',
      form: {
        peso_entrada: '',
        peso_atual: '',
        idade: '',
        necessidade_nutricional: '',
        lote_id: ''
      }
    };
  },
  methods: {
    openAddModal() {
      this.isEditMode = false;
      this.errorMessage = '';
      this.form = {
        peso_entrada: '',
        peso_atual: '',
        idade: '',
        necessidade_nutricional: '',
        lote_id: ''
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    editAnimal(animal) {
      this.isEditMode = true;
      this.errorMessage = '';
      this.form = { ...animal };
      this.showModal = true;
    },
    async saveAnimal() {
      const lotExists = this.lots.some(lot => lot.lote_id === this.form.lote_id);
      if (!lotExists) {
        this.errorMessage = 'O Lote ID fornecido não está cadastrado.';
        return;
      }

      const method = this.isEditMode ? 'PUT' : 'POST';
      const url = this.isEditMode
        ? `http://localhost:8000/animals/${this.form.rfid}`
        : 'http://localhost:8000/animals';

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
          const index = this.animals.findIndex(a => a.rfid === this.form.rfid);
          if (index !== -1) {
            this.animals.splice(index, 1, data);
          }
        } else {
          this.animals.push(data);
        }

        this.closeModal();
        this.fetchAnimals(); // Fetch updated animals list
      } catch (error) {
        console.error('Failed to save animal:', error);
      }
    },
    async deleteAnimal(rfid) {
      try {
        const response = await fetch(`http://localhost:8000/animals/${rfid}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        this.animals = this.animals.filter(a => a.rfid !== rfid);
      } catch (error) {
        console.error('Failed to delete animal:', error);
      }
    },
    async fetchAnimals() {
      try {
        const response = await fetch('http://localhost:8000/list_animal');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.animals = data;
      } catch (error) {
        console.error('Failed to fetch animals:', error);
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
    }
  },
  created() {
    this.fetchAnimals();
    this.fetchLots();
  }
};
</script>

<style scoped>
.animals {
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
