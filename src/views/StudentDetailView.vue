<template>
  <div class="student-detail-view">
    <div class="header">
      <h1>Détails de l'Étudiant</h1>
      <nav>
        <router-link :to="{ name: 'semestres' }" class="btn btn-secondary">
          ← Retour aux Semestres
        </router-link>
      </nav>
    </div>

    <!-- Informations de l'étudiant -->
    <div v-if="student" class="student-info-card">
      <h2>{{ student.nom }} {{ student.prenom }}</h2>
      <div class="student-details">
        <div class="detail-item">
          <strong>Numéro étudiant:</strong> {{ student.numeroEtudiant }}
        </div>
        <div class="detail-item">
          <strong>ID:</strong> {{ student.idEtudiant }}
        </div>
      </div>
    </div>

    <!-- Tableau des moyennes par semestre -->
    <div class="grades-summary">
      <h3>Résultats par Semestre</h3>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Semestre</th>
            <th>Moyenne</th>
            <th>Crédits obtenus</th>
            <th>Statut</th>
            <th>Relevé de notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="semestre in [1, 2, 3, 4]" :key="semestre">
            <td>Semestre {{ semestre }}</td>
            <td :class="getGradeClass(studentMoyennes[`s${semestre}`])">
              {{ studentMoyennes[`s${semestre}`]?.toFixed(2) || '-' }}
            </td>
            <td>{{ studentCredits[`s${semestre}`] || '-' }}</td>
            <td :class="getStatusClass(studentStatuts[`s${semestre}`])">
              {{ getStatusText(studentStatuts[`s${semestre}`]) }}
            </td>
            <td>
              <button 
                @click="showSemesterGrades(semestre)"
                class="btn btn-info btn-small"
                :disabled="!hasNotesForSemester(semestre)"
              >
                Voir le relevé
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Liens pour voir les notes par année -->
    <div class="year-links">
      <h3>Voir les notes par année</h3>
      <div class="year-buttons">
        <button @click="showYearGrades('L1')" class="btn btn-primary">
           Notes L1 (S1 + S2)
        </button>
        <button @click="showYearGrades('L2')" class="btn btn-primary">
           Notes L2 (S3 + S4)
        </button>
      </div>
    </div>

    <!-- Modal pour afficher les relevés de notes -->
    <div v-if="showGradesModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ gradesTitle }}</h3>
          <button @click="closeGradesModal" class="btn-close">&times;</button>
        </div>
        <StudentGrades 
          v-if="selectedGrades.length > 0"
          :grades="selectedGrades"
          :student="student"
          :semester="selectedSemester"
          :summary="gradesSummary"
        />
        <div v-else class="no-data">
          <p>Aucune note disponible pour cette période.</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Chargement des données...</p>
    </div>
  </div>
</template>

<script>
import { notesAPI } from '@/services/api';
import StudentGrades from '@/components/StudentGrades.vue';

export default {
  name: 'StudentDetailView',
  components: {
    StudentGrades
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      student: null,
      allGrades: [],
      loading: false,
      showGradesModal: false,
      selectedGrades: [],
      selectedSemester: null,
      gradesTitle: '',
      gradesSummary: null
    }
  },
  computed: {
    studentMoyennes() {
      const moyennes = {};
      const semesters = [1, 2, 3, 4];
      
      semesters.forEach(semestre => {
        const semesterGrades = this.allGrades.filter(grade => grade.semestre === semestre);
        const validGrades = semesterGrades.filter(grade => grade.note !== null);
        
        if (validGrades.length > 0) {
          moyennes[`s${semestre}`] = validGrades.reduce((acc, grade) => acc + grade.note, 0) / validGrades.length;
        }
      });
      
      return moyennes;
    },
    studentCredits() {
      const credits = {};
      const semesters = [1, 2, 3, 4];
      
      semesters.forEach(semestre => {
        const semesterGrades = this.allGrades.filter(grade => grade.semestre === semestre);
        credits[`s${semestre}`] = semesterGrades
          .filter(grade => grade.note >= 10)
          .reduce((acc, grade) => acc + grade.credit, 0);
      });
      
      return credits;
    },
    studentStatuts() {
      const statuts = {};
      const semesters = [1, 2, 3, 4];
      
      semesters.forEach(semestre => {
        const moyenne = this.studentMoyennes[`s${semestre}`];
        statuts[`s${semestre}`] = moyenne >= 10 ? 'admis' : 'rattrapage';
      });
      
      return statuts;
    }
  },
  async mounted() {
    await this.loadStudentData();
  },
  methods: {
    async loadStudentData() {
      this.loading = true;
      try {
        // Charger toutes les notes de l'étudiant
        const response = await notesAPI.getStudentGrades(this.id);
        this.allGrades = response.data;
        
        if (this.allGrades.length > 0) {
          this.student = {
            idEtudiant: this.allGrades[0].idEtudiant,
            nom: this.allGrades[0].nom,
            prenom: this.allGrades[0].prenom,
            numeroEtudiant: this.allGrades[0].numeroEtudiant
          };
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données étudiant:', error);
        alert('Erreur lors du chargement des données étudiant');
      } finally {
        this.loading = false;
      }
    },
    
    async showSemesterGrades(semesterId) {
      this.loading = true;
      try {
        const response = await notesAPI.getStudentSemesterGrades(this.id, semesterId);
        this.selectedGrades = response.data;
        this.selectedSemester = semesterId;
        this.gradesTitle = `Relevé de Notes - Semestre ${semesterId}`;
        this.calculateGradesSummary();
        this.showGradesModal = true;
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
        alert('Erreur lors du chargement des notes');
      } finally {
        this.loading = false;
      }
    },
    
    async showYearGrades(year) {
      this.loading = true;
      try {
        const response = await notesAPI.getStudentYearGrades(this.id, year);
        this.selectedGrades = response.data;
        this.selectedSemester = year;
        this.gradesTitle = `Relevé de Notes - Année ${year}`;
        this.calculateGradesSummary();
        this.showGradesModal = true;
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
        alert('Erreur lors du chargement des notes');
      } finally {
        this.loading = false;
      }
    },
    
    calculateGradesSummary() {
      if (this.selectedGrades.length === 0) {
        this.gradesSummary = null;
        return;
      }
      
      const validGrades = this.selectedGrades.filter(grade => grade.note !== null);
      if (validGrades.length === 0) {
        this.gradesSummary = null;
        return;
      }
      
      const moyenne = validGrades.reduce((acc, grade) => acc + grade.note, 0) / validGrades.length;
      const totalCredits = validGrades.filter(grade => grade.note >= 10).reduce((acc, grade) => acc + grade.credit, 0);
      const statut = moyenne >= 10 ? 'admis' : 'rattrapage';
      
      this.gradesSummary = {
        moyenne: moyenne,
        totalCredits: totalCredits,
        statut: statut
      };
    },
    
    closeGradesModal() {
      this.showGradesModal = false;
      this.selectedGrades = [];
      this.selectedSemester = null;
      this.gradesTitle = '';
      this.gradesSummary = null;
    },
    
    hasNotesForSemester(semester) {
      return this.allGrades.some(grade => grade.semestre === semester);
    },
    
    getGradeClass(grade) {
      if (!grade) return 'grade-na';
      if (grade >= 12) return 'grade-good';
      if (grade >= 10) return 'grade-average';
      return 'grade-poor';
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'admis': return 'status-valid';
        case 'rattrapage': return 'status-retake';
        default: return 'status-pending';
      }
    },
    
    getStatusText(status) {
      const statusMap = {
        'admis': 'Admis',
        'rattrapage': 'Rattrapage',
        'en_cours': 'En cours'
      };
      return statusMap[status] || status;
    }
  }
}
</script>

<style scoped>
.student-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.student-info-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #007bff;
}

.student-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.detail-item {
  padding: 0.5rem 0;
}

.grades-summary {
  margin-bottom: 2rem;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.summary-table th,
.summary-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: center;
}

.summary-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.year-links {
  text-align: center;
  margin-bottom: 2rem;
}

.year-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

/* Styles pour les status */
.status-valid {
  background-color: #d4edda;
  color: #155724;
}

.status-retake {
  background-color: #fff3cd;
  color: #856404;
}

.status-pending {
  background-color: #e2e3e5;
  color: #383d41;
}
</style>