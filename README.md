# 🚀 TodoList Dockerisée

Application TodoList moderne avec architecture microservices utilisant Docker et Docker Compose.

[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

## 📋 Table des matières

- [Présentation](#présentation)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation rapide](#installation-rapide)
- [Installation détaillée](#installation-détaillée)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Troubleshooting](#troubleshooting)

## 🎯 Présentation

Cette application TodoList démontre la dockerisation d'une application web complète avec :

- ✅ **Architecture microservices** (Frontend, Backend, Base de données)
- ✅ **Plus de 3 endpoints fonctionnels**
- ✅ **Interface web accessible via navigateur**
- ✅ **Configuration via variables d'environnement**
- ✅ **Persistance des données avec volumes Docker**
- ✅ **Health checks et monitoring**
- ✅ **Optimisations et bonnes pratiques de sécurité**

### Fonctionnalités
- 📝 Ajouter des tâches
- ✅ Marquer des tâches comme terminées
- 🗑️ Supprimer des tâches
- 💾 Sauvegarde automatique en base de données
- 📱 Interface responsive et moderne
- 🔄 API REST complète

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 80      │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                            │
                            ▼
                ┌─────────────────────────┐
                │   Docker Network        │
                │   (todolist-network)    │
                └─────────────────────────┘
                            │
                            ▼
                ┌─────────────────────────┐
                │   Persistent Volume     │
                │   (postgres_data)       │
                └─────────────────────────┘
```

### Technologies utilisées

- **Frontend**: HTML5, CSS3, JavaScript ES6+ (modules), Nginx Alpine
- **Backend**: Node.js 18 LTS, Express.js, Driver PostgreSQL (pg)
- **Base de données**: PostgreSQL 15 Alpine
- **Infrastructure**: Docker, Docker Compose, Réseaux isolés
- **Monitoring**: Health checks, Logs structurés, Retry automatique

### Services Docker

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **frontend** | `nginx:alpine` | 80 | Serveur web pour fichiers statiques |
| **backend** | `node:18-alpine` | 3000 | API REST Node.js/Express |
| **db** | `postgres:15-alpine` | 5432 | Base de données PostgreSQL |

## 📦 Prérequis

### Logiciels requis

- **Docker Desktop** : Version 20.10 ou supérieure
- **Docker Compose** : Version 2.0 ou supérieure
- **Git** (optionnel) : Pour cloner le dépôt

### Vérification des prérequis

```bash
# Vérifier Docker
docker --version
# Doit afficher : Docker version 20.10.x ou supérieur

# Vérifier Docker Compose
docker-compose --version
# Doit afficher : Docker Compose version 2.x.x ou supérieur

# Vérifier que Docker fonctionne
docker run hello-world
```

### Installation Docker Desktop

Si Docker n'est pas installé :

1. **Windows** : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. **macOS** : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)
3. **Linux** : [Instructions d'installation](https://docs.docker.com/engine/install/)

## ⚡ Installation rapide

### 1. Cloner le projet

```bash
git clone <URL_DU_DEPOT>
cd TodoList
```

### 2. Démarrer l'application

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier l'état
docker-compose ps
```

### 3. Accéder à l'application

- **Application** : http://localhost:3000
- **API** : http://localhost:3000/api/tasks
- **Health Check** : http://localhost:3000/health

## 🔧 Installation détaillée

### Étape 1 : Préparation de l'environnement

```bash
# 1. Cloner le dépôt
git clone <URL_DU_DEPOT>
cd TodoList

# 2. Vérifier la structure du projet
ls -la
# Vous devriez voir :
# - frontend/
# - backend/
# - docker-compose.yml
# - Dockerfile.backend.simple
# - Dockerfile.frontend
# - nginx.conf
# - init.sql
```

### Étape 2 : Configuration (optionnel)

```bash
# Créer un fichier .env pour personnaliser les variables
cp .env.example .env

# Éditer si nécessaire (par défaut, la configuration fonctionne)
nano .env
```

### Étape 3 : Construction et démarrage

```bash
# Option 1 : Démarrage simple
docker-compose up -d

# Option 2 : Construction forcée (si modifications)
docker-compose build --no-cache
docker-compose up -d

# Option 3 : Démarrage avec logs visibles
docker-compose up
```

### Étape 4 : Vérification du déploiement

```bash
# Vérifier l'état des services
docker-compose ps

# Sortie attendue :
# NAME                IMAGE                   STATUS
# todolist-db         postgres:15-alpine      Up (healthy)
# todolist-backend    todolist-app-backend    Up
# todolist-frontend   todolist-app-frontend   Up

# Vérifier les logs
docker-compose logs backend

# Sortie attendue :
# ✅ Base de données prête !
# 🚀 Serveur TodoList démarré sur le port 3000
# ✅ Connexion à PostgreSQL établie
# ✅ Base de données initialisée avec succès
```

## 🌐 Utilisation

### Accès à l'application

Une fois démarré, l'application est accessible via :

| Service | URL | Description |
|---------|-----|-------------|
| **Application principale** | http://localhost:3000 | Interface utilisateur complète |
| **API REST** | http://localhost:3000/api/tasks | Endpoints JSON |
| **Health Check** | http://localhost:3000/health | État des services |
| **Frontend Nginx** | http://localhost:80 | Serveur web statique (optionnel) |

### Fonctionnalités disponibles

1. **Ajouter une tâche**
   - Saisir le texte dans le champ
   - Cliquer sur "Ajouter" ou appuyer sur Entrée
   - La tâche apparaît immédiatement dans la liste

2. **Marquer comme terminée**
   - Cocher la case à côté de la tâche
   - La tâche est barrée et marquée comme terminée

3. **Supprimer une tâche**
   - Cliquer sur le bouton "Supprimer"
   - Confirmer la suppression
   - La tâche est supprimée définitivement

4. **Persistance des données**
   - Actualiser la page : les données restent
   - Redémarrer Docker : les données persistent
   - Seul `docker-compose down -v` supprime les données

## 📚 API Documentation

### Endpoints disponibles

| Méthode | Endpoint | Description | Exemple |
|---------|----------|-------------|---------|
| **GET** | `/api/tasks` | Récupérer toutes les tâches | `curl http://localhost:3000/api/tasks` |
| **POST** | `/api/tasks` | Créer une nouvelle tâche | `curl -X POST -H "Content-Type: application/json" -d '{"text":"Ma tâche"}' http://localhost:3000/api/tasks` |
| **PUT** | `/api/tasks/:id` | Mettre à jour une tâche | `curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:3000/api/tasks/1` |
| **DELETE** | `/api/tasks/:id` | Supprimer une tâche | `curl -X DELETE http://localhost:3000/api/tasks/1` |
| **GET** | `/health` | Health check de l'API | `curl http://localhost:3000/health` |

### Format des données

#### Tâche (Task)
```json
{
  "id": 1,
  "text": "Ma première tâche",
  "completed": false,
  "created_at": "2024-01-01T10:00:00.000Z",
  "updated_at": "2024-01-01T10:00:00.000Z"
}
```

#### Health Check
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "database": "Connected"
}
```

### Exemples d'utilisation de l'API

```bash
# Récupérer toutes les tâches
curl http://localhost:3000/api/tasks

# Créer une nouvelle tâche
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"text": "Apprendre Docker"}' \
  http://localhost:3000/api/tasks

# Marquer la tâche 1 comme terminée
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"completed": true}' \
  http://localhost:3000/api/tasks/1

# Supprimer la tâche 1
curl -X DELETE http://localhost:3000/api/tasks/1

# Vérifier l'état des services
curl http://localhost:3000/health
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` pour personnaliser la configuration :

```env
# Configuration de la base de données
DB_NAME=todolist
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_securise
DB_PORT=5432

# Configuration de l'application
NODE_ENV=production
PORT=3000
FRONTEND_URL=http://localhost

# Configuration Docker
COMPOSE_PROJECT_NAME=todolist-app
```

### Ports configurables

Modifiez les ports dans `docker-compose.yml` si nécessaire :

```yaml
services:
  backend:
    ports:
      - "3001:3000"  # Changer 3000 en 3001
  
  frontend:
    ports:
      - "8080:80"    # Changer 80 en 8080
  
  db:
    ports:
      - "5433:5432"  # Changer 5432 en 5433
```

## 🛠️ Développement

### Commandes utiles

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart backend

# Voir les logs d'un service
docker-compose logs -f backend

# Entrer dans un conteneur
docker-compose exec backend sh

# Reconstruire les images
docker-compose build --no-cache

# Voir l'utilisation des ressources
docker stats
```

### Structure du projet

```
TodoList/
├── frontend/                    # Frontend HTML/CSS/JS
│   ├── index.html              # Page principale
│   ├── style.css               # Styles CSS
│   ├── main.js                 # Script principal
│   └── script.js               # Logique TodoList
├── backend/                     # Backend Node.js
│   ├── package.json            # Dépendances npm
│   ├── server.js               # Serveur Express
│   ├── wait-for-db.js          # Script d'attente DB
│   └── start.sh                # Script de démarrage
├── docker-compose.yml          # Orchestration des services
├── Dockerfile.backend.simple   # Image du backend
├── Dockerfile.frontend         # Image du frontend
├── nginx.conf                  # Configuration Nginx
├── init.sql                    # Initialisation PostgreSQL
├── .dockerignore              # Fichiers ignorés par Docker
└── README.md                  # Cette documentation
```

### Mode développement

Pour le développement avec hot reload :

```bash
# Utiliser le fichier de développement
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 🔍 Troubleshooting

### Problèmes courants

#### 1. Port déjà utilisé
```bash
# Erreur : "Port 3000 is already in use"
# Solution :
docker-compose down
# Ou changer le port dans docker-compose.yml
```

#### 2. Services ne démarrent pas
```bash
# Vérifier l'état
docker-compose ps

# Voir les logs d'erreur
docker-compose logs

# Redémarrer proprement
docker-compose down
docker-compose up -d
```

#### 3. Base de données inaccessible
```bash
# Vérifier le health check
docker-compose ps

# Voir les logs de la DB
docker-compose logs db

# Redémarrer la DB
docker-compose restart db
```

#### 4. Erreur de construction d'image
```bash
# Reconstruire sans cache
docker-compose build --no-cache

# Nettoyer Docker
docker system prune -f
```

#### 5. Données perdues
```bash
# Vérifier les volumes
docker volume ls

# Si le volume existe mais les données sont perdues
docker-compose down
docker-compose up -d
```

### Logs et debugging

```bash
# Tous les logs
docker-compose logs

# Logs d'un service spécifique
docker-compose logs backend

# Logs en temps réel
docker-compose logs -f

# Dernières lignes seulement
docker-compose logs --tail=50 backend
```

### Nettoyage complet

```bash
# Arrêter et supprimer tout
docker-compose down -v --rmi all

# Nettoyer le système Docker
docker system prune -a -f

# Redémarrer proprement
docker-compose up -d
```

### Vérifications système

```bash
# Espace disque Docker
docker system df

# Images disponibles
docker images

# Conteneurs en cours
docker ps

# Volumes créés
docker volume ls

# Réseaux créés
docker network ls
```

## 🎯 Bonnes pratiques implémentées

- ✅ **Images Alpine** : Réduction de la taille (sécurité + performance)
- ✅ **Multi-stage builds** : Optimisation des images de production
- ✅ **Health checks** : Surveillance automatique des services
- ✅ **Volumes persistants** : Sauvegarde des données
- ✅ **Réseaux isolés** : Sécurisation des communications
- ✅ **Variables d'environnement** : Configuration flexible
- ✅ **Logs structurés** : Facilité de debugging
- ✅ **Retry automatique** : Robustesse face aux erreurs temporaires
- ✅ **Utilisateurs non-root** : Principe de moindre privilège
- ✅ **Documentation complète** : Facilité de maintenance

## 📝 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ pour l'évaluation Docker & Conteneurisation**