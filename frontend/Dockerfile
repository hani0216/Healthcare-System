# Développement - Serveur React
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copie des dépendances et installation
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Expose le port utilisé par 'npm start'
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
