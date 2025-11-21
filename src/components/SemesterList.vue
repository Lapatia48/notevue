<template>
  <div class="semester-list">
    <h2>Liste des Semestres</h2>
    <div class="semester-grid">
      <div 
        v-for="semester in semesters" 
        :key="semester.id" 
        class="semester-card"
        @click="$emit('semester-selected', semester)"
      >
        <h3>Semestre {{ semester.semestre }}</h3>
        <p>Année: {{ semester.annee }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SemesterList',
  props: {
    semesters: {
      type: Array,
      required: true
    }
  },
  emits: ['semester-selected']
}
</script>

<style scoped>
.semester-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.semester-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.semester-card:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.semester-card h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}
</style>