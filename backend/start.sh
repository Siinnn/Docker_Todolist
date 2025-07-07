#!/bin/sh

echo "🚀 Démarrage de l'application TodoList..."

echo "⏳ Attente de la base de données..."
node wait-for-db.js

echo "🚀 Démarrage du serveur..."
node server.js 