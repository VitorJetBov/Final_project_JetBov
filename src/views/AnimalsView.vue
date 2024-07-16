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
            <th>Idade (meses)</th>
            <th>Peso de Entrada</th>
            <th>Peso Atual</th>
            <th>Necessidade Nutricional</th>
            <th>Lote ID</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animal in animals" :key="animal.rfid">
            <td>{{ animal.rfid }}</td>
            <td>{{ animal.age }}</td>
            <td>{{ animal.last_weight }}</td>
            <td>{{ animal.current_weight }}</td>
            <td>{{ animal.nutritional_needs }}</td>
            <td>{{ animal.herd_id }}</td>
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
          <label for="age">Idade (meses):</label>
          <input type="number" v-model="form.age" required />

          <label for="last_weight">Peso de Entrada:</label>
          <input type="number" v-model="form.last_weight" required />

          <label for="current_weight">Peso Atual:</label>
          <input type="number" v-model="form.current_weight" required />

          <label for="nutritional_needs">Necessidade Nutricional:</label>
          <input type="number" v-model="form.nutritional_needs" required />

          <label for="herd_id">Lote ID:</label>
          <input type="number" v-model="form.herd_id" required />

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
      showModal: false,
      isEditMode: false,
      errorMessage: '',
      form: {
        age: '',
        last_weight: '',
        current_weight: '',
        nutritional_needs: '',
        herd_id: ''
      }
    };
  },
  methods: {
    openAddModal() {
      this.isEditMode = false;
      this.errorMessage = '';
      this.form = {
        age: '',
        last_weight: '',
        current_weight: '',
        nutritional_needs: '',
        herd_id: ''
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    editAnimal(animal) {
      if (!animal || !animal.rfid) {
        this.errorMessage = 'Animal selecionado não possui RFID';
        return;
      }
      this.isEditMode = true;
      this.errorMessage = '';
      this.form = { ...animal };
      this.showModal = true;
    },
    async saveAnimal() {
      const method = this.isEditMode ? 'PUT' : 'POST';
      const url = this.isEditMode
        ? `http://192.168.15.46:8000/update_animal/${this.form.rfid}`
        : 'http://192.168.15.46:8000/create_animal';

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            age: this.form.age,
            last_weight: this.form.last_weight,
            current_weight: this.form.current_weight,
            nutritional_needs: this.form.nutritional_needs,
            herd_id: this.form.herd_id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || response.statusText);
        }

        const data = await response.json();

        if (this.isEditMode) {
          const index = this.animals.findIndex(a => a.rfid === data.rfid);
          if (index !== -1) {
            this.animals.splice(index, 1, data);
          }
        } else {
          this.animals.push(data);
        }

        this.closeModal();
        this.fetchAnimals();
      } catch (error) {
        this.errorMessage = `Failed to save animal: ${error.message}`;
      }
    },
    async deleteAnimal(rfid) {
      if (!rfid) {
        this.errorMessage = 'RFID não pode ser nulo';
        return;
      }
      try {
        const response = await fetch(`http://192.168.15.46:8000/delete_animal/${rfid}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || response.statusText);
        }

        this.animals = this.animals.filter(a => a.rfid !== rfid);
      } catch (error) {
        this.errorMessage = `Failed to delete animal: ${error.message}`;
      }
    },
    async fetchAnimals() {
      try {
        const response = await fetch('http://192.168.15.46:8000/list_animal');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || response.statusText);
        }
        const data = await response.json();
        this.animals = data;
      } catch (error) {
        this.errorMessage = `Failed to fetch animals: ${error.message}`;
      }
    }
  },
  created() {
    this.fetchAnimals();
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
