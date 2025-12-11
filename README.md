# Formulaire de Commande - Prothèses Dentaires

Formulaire React pour la commande de prothèses dentaires auprès du laboratoire.

## Déploiement GitHub Pages

Le déploiement est automatique via GitHub Actions. À chaque push sur `main`, le site est rebuilé et déployé.

### Configuration requise dans GitHub :

1. **Settings → Pages → Source** : Sélectionner "GitHub Actions"
2. **Settings → Pages → Custom domain** : `xlab-order.cemedis.app`
3. Cocher "Enforce HTTPS"

### DNS (chez ton registrar) :

```
Type: CNAME
Name: xlab-order
Value: <ton-username>.github.io
```

## Installation locale

```bash
npm install
```

## Développement

```bash
npm run dev
```

Ouvre http://localhost:5173 dans ton navigateur.

## Build production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`.

## Paramètres URL

Le formulaire accepte les paramètres URL suivants pour préremplir les champs :

| Paramètre | Description |
|-----------|-------------|
| `ID_commande` | Numéro du bon de commande |
| `ID_praticien` | ID Veasy du praticien |
| `ID_centre` | ID Veasy du centre |
| `Patient_id` | ID Veasy du patient |
| `Patient_nom` | Nom du patient |
| `Patient_prenom` | Prénom du patient |
| `Praticien_nom` | Nom du praticien |
| `Centre_nom` | Nom du centre |

### Exemple d'URL

```
https://xlab-order.cemedis.app/?ID_commande=BC-2024-001&Praticien_nom=Dr.%20Martin&Centre_nom=Paris%2015&Patient_nom=DUPONT&Patient_prenom=Jean
```

## Soumission

À la validation, le formulaire redirige vers :
```
https://app.applications-cemedis.fr/bonsdecommandesxlab?id=...&centre=...&praticien=...
```

## Catégories de produits

- 🦷 **Prothèses Fixes** (Conjointe) : Couronnes, bridges, inlays, facettes
- 🦴 **Prothèses Mobiles** (Adjointe) : PEI, PBM, stellites, prothèses résine
- ⚙️ **Implantologie** : Couronnes sur implants, piliers, locators
- ✨ **Orthodontie** : Gouttières, modèles d'étude, fils de contention

## Charte graphique

Couleur principale : `#004B63` (CEMEDIS) 
