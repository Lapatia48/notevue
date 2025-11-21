<template>
  <div class="students-view">
    <div class="header">
      <h1>Étudiants - Semestre {{ $route.params.id }}</h1>
      <nav>
        <router-link to="/semestres" class="btn btn-secondary">Retour aux Semestres</router-link>
      </nav>
    </div>

    <StudentList 
      :students="students"
      :title="`Semestre ${$route.params.id}`"
      @student-selected="onStudentSelected"
      @show-grades="onShowGrades"
    />

    <!-- Modal des notes -->
    <div v-if="showGradesModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Relevé de Notes</h3>
          <button @click="showGradesModal = false" class="btn-close">&times;</button>
        </div>
        <StudentGrades 
          v-if="selectedGrades"
          :grades="selectedGrades"
          :student="selectedStudent"
          :semester="selectedSemester"
        />
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
import StudentList from '@/components/StudentList.vue';
import StudentGrades from '@/components/StudentGrades.vue';

export default {
  name: 'StudentsView',
  components: {
    StudentList,
    StudentGrades
  },
  data() {
    return {
      students: [],
      loading: false,
      showGradesModal: false,
      selectedGrades: null,
      selectedStudent: {},
      selectedSemester: null
    }
  },
  async mounted() {
    await this.loadStudents();
  },
  methods: {
    async loadStudents() {
      this.loading = true;
      try {
        const semesterId = this.$route.params.id;
        const response = await notesAPI.getSemesterGrades(semesterId);
        
        // Grouper les notes par étudiant et calculer les moyennes
        this.students = this.processStudentsData(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des étudiants:', error);
        alert('Erreur lors du chargement des étudiants');
      } finally {
        this.loading = false;
      }
    },
    processStudentsData(gradesData) {
      const studentsMap = new Map();
      
      gradesData.forEach(grade => {
        if (!studentsMap.has(grade.idEtudiant)) {
          studentsMap.set(grade.idEtudiant, {
            idEtudiant: grade.idEtudiant,
            nom: grade.nom,
            prenom: grade.prenom,
            numeroEtudiant: grade.numeroEtudiant,
            moyennes: {},
            notes: []
          });
        }
        
        const student = studentsMap.get(grade.idEtudiant);
        student.notes.push(grade);
      });

      // Calculer les moyennes pour chaque étudiant
      studentsMap.forEach(student => {
        student.moyennes = this.calculateAverages(student.notes);
      });

      return Array.from(studentsMap.values());
    },
    calculateAverages(notes) {
      const averages = {};
      const semesters = [...new Set(notes.map(note => note.semestre))];
      
      semesters.forEach(semester => {
        const semesterNotes = notes.filter(note => note.semestre === semester);
        const validNotes = semesterNotes.filter(note => note.note !== null);
        
        if (validNotes.length > 0) {
          const sum = validNotes.reduce((acc, note) => acc + note.note, 0);
          averages[`s${semester}`] = sum / validNotes.length;
        }
      });
      
      return averages;
    },
    onStudentSelected(student) {
      this.$router.push({
        name: 'etudiant-detail',
        params: { id: student.idEtudiant }
      });
    },
    async onShowGrades(numeroEtudiant, semesterId) {
        this.loading = true;
        try {
        const response = await notesAPI.getStudentSemesterGrades(numeroEtudiant, semesterId);
        this.selectedGrades = response.data;
        
        // Trouver l'étudiant par son numéro
        this.selectedStudent = this.students.find(s => s.numeroEtudiant === numeroEtudiant);
        
        // Si l'étudiant n'est pas trouvé dans la liste, créer un objet basique
        if (!this.selectedStudent && this.selectedGrades.length > 0) {
            this.selectedStudent = {
            numeroEtudiant: numeroEtudiant,
            nom: this.selectedGrades[0].nom,
            prenom: this.selectedGrades[0].prenom
            };
        }
        
        this.selectedSemester = semesterId;
        this.showGradesModal = true;
        } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
        alert('Erreur lors du chargement des notes');
        } finally {
        this.loading = false;
        }
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.btn-close:hover {
  color: #495057;
}
</style>