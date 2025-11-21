import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Pour le développement, vous pouvez commenter l'intercepteur d'authentification
/*
const AUTH_TOKEN = 'your-token-here';
api.interceptors.request.use((config) => {
  if (AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return config;
});
*/

export const notesAPI = {
  // Authentification
  login(credentials) {
    return api.post('/auth/login', credentials);
  },

  // Semestres
  async getSemesters() {
    try {
      const response = await api.get('/notes/semestres');
      // L'API retourne [1, 2, 3, 4], on transforme en objets
      const semestersArray = response.data;
      
      const semestersObjects = semestersArray.map(semestreNum => ({
        id: semestreNum,
        semestre: semestreNum,
        annee: semestreNum <= 2 ? 'L1' : 'L2',
        // annee_academique: '2023-2024'
      }));
      
      return { data: semestersObjects };
    } catch (error) {
      console.error('Erreur API getSemesters:', error);
      throw error;
    }
  },

  // Années
  getAcademicYears() {
    return api.get('/notes/annees');
  },

  // Notes par semestre
  getSemesterGrades(semesterId) {
    return api.get(`/notes/semestre/${semesterId}`);
  },

  // Notes par année
  getYearGrades(year) {
    return api.get(`/notes/annee/${year}`);
  },

  // Notes d'un étudiant
  getStudentGrades(studentId) {
    return api.get(`/notes/etudiant/${studentId}`);
  },

  // Notes d'un étudiant par semestre
  getStudentSemesterGrades(studentId, semesterId) {
    return api.get(`/notes/semestre/${semesterId}/etudiant/${studentId}`);
  },

  // Notes d'un étudiant par année
  getStudentYearGrades(studentId, year) {
    return api.get(`/notes/annee/${year}/etudiant/${studentId}`);
  },

  // Toutes les notes
  getAllGrades() {
    return api.get('/notes');
  }
};

export default api;