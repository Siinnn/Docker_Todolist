const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'todolist',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static('../frontend'));

// Fonction d'initialisation de la base de données
async function initDB() {
  try {
    // Attendre que la connexion soit établie
    const connected = await testDBConnection();
    if (!connected) {
      console.error('❌ Impossible d\'initialiser la DB sans connexion');
      process.exit(1);
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        text VARCHAR(500) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Base de données initialisée avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation de la DB:', err);
    process.exit(1);
  }
}

// Test de connexion à la base de données avec retry
async function testDBConnection(retries = 10) {
  try {
    const client = await pool.connect();
    console.log('✅ Connexion à PostgreSQL établie');
    client.release();
    return true;
  } catch (err) {
    console.error(`❌ Erreur de connexion à la DB (tentative ${11 - retries}/10):`, err.message);
    if (retries > 0) {
      console.log(`⏳ Nouvelle tentative dans 5 secondes...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return testDBConnection(retries - 1);
    } else {
      console.error('❌ Impossible de se connecter à la base de données après 10 tentatives');
      return false;
    }
  }
}

// Routes API - Récupérer toutes les tâches
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur GET /api/tasks:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
  }
});

// Routes API - Créer une nouvelle tâche
app.post('/api/tasks', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Le texte de la tâche est requis' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (text) VALUES ($1) RETURNING *',
      [text.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur POST /api/tasks:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
  }
});

// Routes API - Mettre à jour une tâche (toggle completed)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const result = await pool.query(
      'UPDATE tasks SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [completed, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur PUT /api/tasks/:id:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la tâche' });
  }
});

// Routes API - Supprimer une tâche
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Erreur DELETE /api/tasks/:id:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la tâche' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (err) {
    res.status(503).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: err.message
    });
  }
});

// Route pour servir le frontend
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../frontend' });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur TodoList démarré sur le port ${PORT}`);
  console.log(`📱 Application accessible sur http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  
  // Initialiser la base de données (inclut le test de connexion)
  await initDB();
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await pool.end();
  process.exit(0);
}); 