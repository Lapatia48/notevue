<template>
  <div class="student-list">
    <h2>Liste des Étudiants - {{ title }}</h2>
    <table class="students-table">
      <thead>
        <tr>
          <th>Numéro</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Moyenne S1</th>
          <th>Moyenne S2</th>
          <th>Moyenne S3</th>
          <th>Moyenne S4</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.numeroEtudiant">
        <td>
        <router-link 
            :to="{ name: 'etudiant-detail', params: { id: student.numeroEtudiant } }"
            class="student-link"
        >
            {{ student.numeroEtudiant }}
        </router-link>
        </td>      
            
        <td>{{ student.nom }}</td>
          <td>{{ student.prenom }}</td>
          <td>
            <span 
              class="grade-link"
              @click="$emit('show-grades', student.numeroEtudiant, 1)"
              :class="getGradeClass(student.moyennes?.s1)"
            >
              {{ student.moyennes?.s1?.toFixed(2) || '-' }}
            </span>
          </td>
          <td>
            <span 
              class="grade-link"
              @click="$emit('show-grades', student.numeroEtudiant, 2)"
              :class="getGradeClass(student.moyennes?.s2)"
            >
              {{ student.moyennes?.s2?.toFixed(2) || '-' }}
            </span>
          </td>
          <td>
            <span 
              class="grade-link"
              @click="$emit('show-grades', student.numeroEtudiant, 3)"
              :class="getGradeClass(student.moyennes?.s3)"
            >
              {{ student.moyennes?.s3?.toFixed(2) || '-' }}
            </span>
          </td>
          <td>
            <span 
              class="grade-link"
              @click="$emit('show-grades', student.numeroEtudiant, 4)"
              :class="getGradeClass(student.moyennes?.s4)"
            >
              {{ student.moyennes?.s4?.toFixed(2) || '-' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'StudentList',
  props: {
    students: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Étudiants'
    }
  },
  emits: ['student-selected', 'show-grades'],
  methods: {
    getGradeClass(grade) {
      if (!grade) return 'grade-na';
      if (grade >= 12) return 'grade-good';
      if (grade >= 10) return 'grade-average';
      return 'grade-poor';
    }
  }
}
</script>

<style scoped>
.students-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.student-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.student-link:hover {
  text-decoration: underline;
  color: #0056b3;
}

.students-table th,
.students-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.students-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.grade-link {
  cursor: pointer;
  text-decoration: underline;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.grade-good {
  background-color: #d4edda;
  color: #155724;
}

.grade-average {
  background-color: #fff3cd;
  color: #856404;
}

.grade-poor {
  background-color: #f8d7da;
  color: #721c24;
}

.grade-na {
  color: #6c757d;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}
</style>