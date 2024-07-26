# La bible digitale en malgache avec ElasticSearch/OpenSearch et Nuxt.js

Ce projet montre l'utilisation d'ElasticSearch avec Node.js et Vue.js grâce à Nuxt.js.

Documentation Nuxt :

- [Nuxt](https://nuxt.com/docs/getting-started/introduction)
- [Vuetify](https://vuetifyjs.com/en/components/all/)
- [NuxtHub](https://hub.nuxt.com)

Documentation ElasticSearch :

- [Pas dans ElasticSearch Cloud pendant l'essai gratuit](https://www.elastic.co/blog/introducing-query-rules-elasticsearch-8-10)
- [Docker ElacticSearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
- [Changer son mot de passe en local](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-stack-security.html)
- [Pour plus de mémoire RAM en local](https://stackoverflow.com/a/42906451)

## Indexation des versets bibliques

- [Lancer ElasticSearch](https://www.elastic.co/fr/downloads/elasticsearch) puis :

```bash
npm install
cd Bible_Malagasy_1865
node open-search-ingest.js
```

## Démarrer le serveur

Lancer le serveur de développement sur : `http://localhost:3000`:

```bash
npm run dev
```

## Préparation au déploiement

Pour générer un livrable de production, lancer :

```bash
npm run build
```

[Documentation](https://hub.nuxt.com/docs/getting-started/deploy) pour plus d'informations.

## Déploiement

Pour déployer l'application avec un compte Cloudflare:

```bash
npx nuxthub deploy
```

Pour consultation de logs et métriques du site, visiter: [NuxtHub Admin](https://admin.hub.nuxt.com).

Alternative de déploiement: [Cloudflare Pages CI](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci).
