# Persistance de la configuration Keycloak

## 1. Persistance automatique via la base de données
- Les données Keycloak (realms, utilisateurs, clients, etc.) sont stockées dans la base MariaDB.
- Le volume Docker `mariadb_data` (défini dans `docker-compose.yml`) assure la persistance des données.
- **Ne jamais exécuter `docker-compose down -v`** sauf si vous souhaitez tout réinitialiser.

## 2. Export manuel du realm Keycloak
- Après toute modification importante (ajout d'utilisateur, client, etc.), exportez le realm :
  1. Connectez-vous à l'interface d'administration Keycloak.
  2. Allez dans "Realm Settings" > "Export".
  3. Choisissez d'exporter le realm (avec ou sans utilisateurs selon le besoin).
  4. Téléchargez le fichier JSON.
  5. Remplacez le fichier `keycloak-import/mrecords-realm.json` par ce nouveau fichier exporté.
- Versionnez ce fichier dans git pour garder l'historique.

## 3. Import automatique au démarrage
- Le fichier `keycloak-import/mrecords-realm.json` est automatiquement importé au démarrage de Keycloak si la base est vide.
- Cela est géré par la variable d'environnement `KC_IMPORT` dans `docker-compose.yml`.

## 4. Récapitulatif
- **Pour garantir la persistance :**
  - Ne supprimez pas le volume MariaDB.
  - Exportez et versionnez régulièrement votre realm.
  - Le fichier d'import permet de restaurer la configuration en cas de perte de la base. 