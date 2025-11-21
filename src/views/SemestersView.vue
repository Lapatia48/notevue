<template>
  <div class="semesters-view">
    <div class="header">
      <h1>Gestion des Notes - Semestres</h1>
      <nav>
        <router-link to="/" class="btn btn-secondary">Accueil</router-link>
      </nav>
    </div>

    <SemesterList 
      :semesters="semesters"
      @semester-selected="onSemesterSelected"
    />

    <!-- Modal pour le chargement -->
    <div v-if="loading" class="loading-modal">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>
  </div>
</template>

<script>
import { notesAPI } from '@/services/api';
import SemesterList from '@/components/SemesterList.vue';

export default {
  name: 'SemestersView',
  components: {
    SemesterList
  },
  data() {
    return {
      semesters: [],
      loading: false
    }
  },
  async mounted() {
    await this.loadSemesters();
  },
  methods: {
    async loadSemesters() {
        this.loading = true;
        try {
        const response = await notesAPI.getSemesters();
        console.log('Données reçues:', response.data); // DEBUG
        this.semesters = response.data;
        } catch (error) {
        console.error('Erreur détaillée:', error); // DEBUg
        console.error('Erreur lors du chargement des semestres:', error);
        alert('Erreur lors du chargement des semestres');
        } finally {
        this.loading = false;
        }
    },
    onSemesterSelected(semester) {
      this.$router.push({
        name: 'etudiants-semestre',
        params: { id: semester.semestre }
      });
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.loading-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  display: inline-block;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>