<template>
  <div class="student-detail-view">
    <div class="header">
      <h1>Détail de l'Étudiant</h1>
      <nav>
        <router-link to="/semestres" class="btn btn-secondary">Retour aux Semestres</router-link>
      </nav>
    </div>

    <div v-if="student" class="student-info">
      <h2>{{ student.nom }} {{ student.prenom }}</h2>
      <div class="info-grid">
        <div class="info-item">
          <label>Numéro étudiant:</label>
          <span>{{ student.numeroEtudiant }}</span>
        </div>
        <div class="info-item">
          <label>Date de naissance:</label>
          <span>{{ formatDate(student.date_naissance) }}</span>
        </div>
      </div>
    </div>

    <div class="grades-summary">
      <h3>Résultats par Semestre</h3>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Semestre</th>
            <th>Moyenne</th>
            <th>Crédits obtenus</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in studentResults" :key="result.semestre">
            <td>Semestre {{ result.semestre }}</td>
            <td :class="getGradeClass(result.moyenne_semestre)">
              {{ result.moyenne_semestre?.toFixed(2) || '-' }}
            </td>
            <td>{{ result.credit_obtenu || '-' }}</td>
            <td :class="getStatusClass(result.statut)">
              {{ getStatusText(result.statut) }}
            </td>
            <td>
              <button 
                @click="showSemesterGrades(result.semestre)"
                class="btn btn-info"
              >
                Voir notes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="year-actions">
      <button @click="showYearGrades('L1')" class="btn btn-primary">
        Voir toutes les notes L1 (S1 + S2)
      </button>
      <button @click="showYearGrades('L2')" class="btn btn-primary">
        Voir toutes les notes L2 (S3 + S4)
      </button>
    </div>

    <!-- Modal des notes -->
    <div v-if="showGradesModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ gradesTitle }}</h3>
          <button @click="showGradesModal = false" class="btn-close">&times;</button>
        </div>
        <StudentGrades 
          v-if="selectedGrades.length > 0"
          :grades="selectedGrades"
          :student="student"
          :semester="selectedSemester"
          :summary="gradesSummary"
          :show-year-links="false"
        />
        <div v-else class="no-data">
          <p>Aucune note disponible pour cette période.</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-modal">
      <div class="spinner"></div>
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
  data() {
    return {
      student: null,
      studentResults: [],
      loading: false,
      showGradesModal: false,
      selectedGrades: [],
      selectedSemester: null,
      gradesTitle: '',
      gradesSummary: null
    }
  },
  async mounted() {
    await this.loadStudentData();
  },
  methods: {
    async loadStudentData() {
      this.loading = true;
      try {
        const studentId = this.$route.params.id;
        
        // Charger les informations de l'étudiant
        const gradesResponse = await notesAPI.getStudentGrades(studentId);
        const allGrades = gradesResponse.data;
        
        if (allGrades.length > 0) {
          this.student = {
            idEtudiant: allGrades[0].idEtudiant,
            nom: allGrades[0].nom,
            prenom: allGrades[0].prenom,
            numeroEtudiant: allGrades[0].numeroEtudiant
          };
          
          // Calculer les résultats par semestre
          this.studentResults = this.calculateSemesterResults(allGrades);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données étudiant:', error);
        alert('Erreur lors du chargement des données étudiant');
      } finally {
        this.loading = false;
      }
    },
    calculateSemesterResults(grades) {
      const semesters = [...new Set(grades.map(grade => grade.semestre))];
      return semesters.map(semester => {
        const semesterGrades = grades.filter(grade => grade.semestre === semester);
        const validGrades = semesterGrades.filter(grade => grade.note !== null);
        
        let moyenne = null;
        let creditObtenu = 0;
        let statut = 'en_cours';
        
        if (validGrades.length > 0) {
          moyenne = validGrades.reduce((acc, grade) => acc + grade.note, 0) / validGrades.length;
          creditObtenu = validGrades.filter(grade => grade.note >= 10).reduce((acc, grade) => acc + grade.credit, 0);
          statut = moyenne >= 10 ? 'admis' : 'rattrapage';
        }
        
        return {
          semestre: semester,
          moyenne_semestre: moyenne,
          credit_obtenu: creditObtenu,
          statut: statut
        };
      }).sort((a, b) => a.semestre - b.semestre);
    },
    async showSemesterGrades(semesterId) {
      this.loading = true;
      try {
        const studentId = this.$route.params.id;
        const response = await notesAPI.getStudentSemesterGrades(studentId, semesterId);
        this.selectedGrades = response.data;
        this.selectedSemester = semesterId;
        this.gradesTitle = `Notes - Semestre ${semesterId}`;
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
        const studentId = this.$route.params.id;
        const response = await notesAPI.getStudentYearGrades(studentId, year);
        this.selectedGrades = response.data;
        this.selectedSemester = year;
        this.gradesTitle = `Notes - Année ${year}`;
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
      const moyenne = validGrades.reduce((acc, grade) => acc + grade.note, 0) / validGrades.length;
      const totalCredits = validGrades.filter(grade => grade.note >= 10).reduce((acc, grade) => acc + grade.credit, 0);
      const statut = moyenne >= 10 ? 'admis' : 'rattrapage';
      
      this.gradesSummary = {
        moyenne: moyenne,
        totalCredits: totalCredits,
        statut: statut
      };
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('fr-FR');
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
.student-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: bold;
  color: #495057;
  margin-bottom: 0.25rem;
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
  text-align: left;
}

.summary-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.year-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}
</style>