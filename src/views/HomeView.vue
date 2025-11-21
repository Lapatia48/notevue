<template>
  <div class="home-view">
    <div class="hero">
      <h1>Système de Gestion des Notes</h1>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3> Semestres</h3>
        <p>Consultation de note par semestre</p><br>
        <router-link to="/semestres" class="btn btn-primary">
          Voir les semestres
        </router-link>
      </div>
            
      
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    navigateToStudents() {
      // Pour l'instant, rediriger vers le premier semestre
      this.$router.push('/semestre/1/etudiants');
    }
  }
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e9ecef;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.quick-stats {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h4 {
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>