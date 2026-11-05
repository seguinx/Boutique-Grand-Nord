
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { db } from './db.js';

// Calculer le prix de la commande
function calculerTotal(produit, data) {
  let sousTotal = produit.prix * data.quantite;

  if (data.livraison === 'domicile') {
    sousTotal += 25;
  }

  if (data.options.includes('installation')) {
    sousTotal += 49;
  }

  if (data.options.includes('garantie')) {
    sousTotal += 99;
  }

  return Math.round(sousTotal * 113) / 100;
}

// Lire le corps de la requête
async function lireCorps(req) {
  let corps = '';

  for await (const morceau of req) {
    corps += morceau;
  }

  return corps;
}

// Envoyer une réponse JSON
function envoyerJson(res, statut, donnees) {
  res.writeHead(statut, {
    'Content-Type': 'application/json; charset=utf-8',
  });

  res.end(JSON.stringify(donnees));
}

// Types de fichiers
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

// Servir les fichiers HTML, CSS et JS
async function servirFichier(res, pathname) {
  const fichier = pathname === '/' ? '/index.html' : pathname;
  const chemin = path.join('public', fichier);
  const type = TYPES[path.extname(chemin)] || 'text/plain';

  try {
    const contenu = await fs.readFile(chemin);
    res.writeHead(200, { 'Content-Type': type });
    res.end(contenu);
  } catch (erreur) {
    res.writeHead(404);
    res.end('Page introuvable');
  }
}

// Créer le serveur
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const route = req.method + ' ' + url.pathname;

  console.log(route);

  // GET : récupérer les produits
  if (route === 'GET /api/produits') {
    const catalogue = db.prepare(
      'SELECT * FROM produits'
    ).all();

    return envoyerJson(res, 200, catalogue);
  }

  // GET : récupérer les commandes
  if (route === 'GET /api/commandes') {
    const commandes = db.prepare(
      'SELECT * FROM commandes ORDER BY id DESC').all();
    return envoyerJson(res, 200, commandes);
  }
  

  // POST : créer une commande
  if (route === 'POST /api/commandes') {
    const data = JSON.parse(await lireCorps(req));

    const produit = db.prepare(
      'SELECT * FROM produits WHERE id = ?'
    ).get(data.produitId);

    const quantite = Number(data.quantite);

    // Vérifier les informations
    if (!data.nom || !data.courriel) {
      return envoyerJson(res, 400, {
        erreur: 'Nom et courriel obligatoires'
      });
    }

    if (data.livraison === 'domicile' && !data.adresse) {
      return envoyerJson(res, 400, {
        erreur: 'Adresse obligatoire'
      });
    }

    if (!Number.isInteger(quantite) || quantite < 1) {
      return envoyerJson(res, 400, {
        erreur: 'Quantité invalide'
      });
    }

    if (!produit) {
      return envoyerJson(res, 404, {
        erreur: 'Produit inconnu'
      });
    }

    if (quantite > produit.stock) {
      return envoyerJson(res, 409, {
        erreur: `Il ne reste que ${produit.stock} en stock`
      });
    }

    // Calculer le total
    const total = calculerTotal(produit, data);
    const heure = new Date().toLocaleTimeString('fr-CA');

    // Enregistrer la commande dans SQLite
    const resultat = db.prepare(`
      INSERT INTO commandes
      (client, courriel, produit, quantite,
       livraison, options, total, heure)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.nom,
      data.courriel,
      produit.nom,
      quantite,
      data.livraison,
      data.options.join(', '),
      total,
      heure
    );

    // Diminuer le stock
    db.prepare('UPDATE produits SET stock = stock - ? WHERE id = ?')
      .run(quantite, produit.id);

    return envoyerJson(res, 201, {
      id: Number(resultat.lastInsertRowid),
      total
    });
  }

  // Afficher les autres fichiers
  return servirFichier(res, url.pathname);
});

// Démarrer le serveur
server.listen(process.env.PORT || 3000, () => {
  console.log(
    `Boutique : http://localhost:${process.env.PORT || 3000}`
  );
});
