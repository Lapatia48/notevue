<template>
  <div class="student-grades">
    <div class="grades-header">
      <h2>Relevé de Notes</h2>
      <div class="student-info">
        <h3>{{ student.nom }} {{ student.prenom }}</h3>
        <p>Numéro: {{ student.numeroEtudiant }}</p>
        <p>Semestre: {{ semester }}</p>
      </div>
    </div>

    <table class="grades-table">
      <thead>
        <tr>
          <th>Matière</th>
          <th>UE</th>
          <th>Crédits</th>
          <th>Note</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grade in grades" :key="grade.ueMatiere">
          <td>{{ grade.nomMatiere }}</td>
          <td>{{ grade.ueMatiere }}</td>
          <td>{{ grade.credit }}</td>
          <td :class="getNoteClass(grade.note)">
            {{ grade.note?.toFixed(2) || '-' }}
          </td>
          <td :class="getStatusClass(grade.statut)">
            {{ getStatusText(grade.statut) }}
          </td>
        </tr>
      </tbody>
      <tfoot v-if="summary">
        <tr>
          <td colspan="2"><strong>Moyenne:</strong></td>
          <td><strong>Total crédits: {{ summary.totalCredits }}</strong></td>
          <td><strong>{{ summary.moyenne?.toFixed(2) }}</strong></td>
          <td :class="getStatusClass(summary.statut)">
            <strong>{{ getStatusText(summary.statut) }}</strong>
          </td>
        </tr>
      </tfoot>
    </table>

    <div class="grades-actions" v-if="showYearLinks">
      <button @click="$emit('show-year', 'L1')" class="btn btn-primary">
        Voir Année L1
      </button>
      <button @click="$emit('show-year', 'L2')" class="btn btn-primary">
        Voir Année L2
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentGrades',
  props: {
    grades: {
      type: Array,
      required: true
    },
    student: {
      type: Object,
      required: true
    },
    semester: {
      type: [String, Number],
      default: ''
    },
    summary: {
      type: Object,
      default: null
    },
    showYearLinks: {
      type: Boolean,
      default: false
    }
  },
  emits: ['show-year'],
  methods: {
    getNoteClass(note) {
      if (!note) return 'note-na';
      if (note >= 12) return 'note-good';
      if (note >= 10) return 'note-average';
      return 'note-poor';
    },
    getStatusClass(status) {
      switch (status) {
        case 'valide':
          return 'status-valid';
        case 'rattrapage':
          return 'status-retake';
        case 'admis':
          return 'status-admitted';
        default:
          return 'status-pending';
      }
    },
    getStatusText(status) {
      const statusMap = {
        'valide': 'Validé',
        'rattrapage': 'Rattrapage',
        'admis': 'Admis',
        'en_cours': 'En cours'
      };
      return statusMap[status] || status;
    }
  }
}
</script>

<style scoped>
.grades-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.student-info {
  text-align: right;
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.grades-table th,
.grades-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.grades-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.grades-table tfoot {
  background-color: #e9ecef;
  font-weight: bold;
}

.note-good {
  background-color: #d4edda;
  color: #155724;
}

.note-average {
  background-color: #fff3cd;
  color: #856404;
}

.note-poor {
  background-color: #f8d7da;
  color: #721c24;
}

.note-na {
  color: #6c757d;
}

.status-valid {
  background-color: #d4edda;
  color: #155724;
}

.status-retake {
  background-color: #fff3cd;
  color: #856404;
}

.status-admitted {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-pending {
  background-color: #e2e3e5;
  color: #383d41;
}

.grades-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>