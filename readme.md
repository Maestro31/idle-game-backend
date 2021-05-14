# Pour démarrer le serveur

Prérequis:

La variable d'environnement SECRET_KEY doit être fournie pour le bon fonctionnement des tokens JWT.
Il est possible de la fournir dans un fichier .env à la racine du projet.

Lancement:

```
$ yarn install
$ yarn db:create:dev
$ yarn dev
```

## Lancer les tests unitaires

```
$ yarn test
```

## Lancer les tests d'intégrations

```
$ yarn test:integration
```
