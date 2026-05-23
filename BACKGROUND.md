# Exécution en arrière-plan

Ce fichier explique comment l’application continue de tourner en arrière-plan, sans bloquer ton terminal.

## Avec Docker Compose

Le mode détaché de Docker Compose permet de lancer les services et de rendre le terminal disponible immédiatement.

### Commande principale

```bash
docker compose up --build -d
```

### Que fait-elle ?

- `docker compose up` démarre les services définis dans `docker-compose.yml`
- `--build` reconstruit les images si les sources ont changé
- `-d` exécute les conteneurs en mode détaché (background)

### Résultat

- les conteneurs continuent de tourner même si tu fermes la console locale
- le backend Spring Boot tourne dans un conteneur Docker
- le frontend React/Nginx tourne dans un autre conteneur Docker
- Docker gère l’isolation, le réseau et le cycle de vie des conteneurs

### Gestion

- Voir les logs :
  ```bash
docker compose logs -f
```
- Arrêter les services :
  ```bash
docker compose down
```
- Redémarrer les services :
  ```bash
docker compose restart
```

## Avec Kubernetes

Kubernetes utilise des objets de type `Deployment` et `Service` pour maintenir l’application en fonctionnement.

### Pourquoi l’application reste active

- un `Deployment` crée des `Pods` qui contiennent tes conteneurs
- si un conteneur se plante, Kubernetes redémarre automatiquement le pod
- les `Pods` sont gérés par le cluster, pas par ton terminal
- les `Services` exposent les applications et font la découverte de services

### Commandes principales

Déployer les manifests :

```bash
kubectl apply -k k8s
```

Vérifier l’état des pods :

```bash
kubectl get pods -n gestionmotpasse
```

Voir les logs d’un pod :

```bash
kubectl logs -n gestionmotpasse <pod-name>
```

### Résultat

- Kubernetes orchestre les instances de ton application
- le backend et le frontend tournent en permanence
- tu n’as pas besoin de laisser une session SSH ouverte
- le cluster redémarre les pods en cas de problème

## En résumé

- Avec Docker Compose : le drapeau `-d` active l’exécution en arrière-plan
- Avec Kubernetes : les `Deployments` et `Pods` maintiennent l’application active
- Sur EC2 : tu n’as besoin que de Docker et Docker Compose
- Pas d’Apache, pas de Tomcat à installer sur l’instance EC2

Utilise ce fichier comme référence pour savoir pourquoi et comment ton application reste en fonctionnement après le déploiement.