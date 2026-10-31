import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { produits } from './produits.js';

function calculerTotal(produit, data) {
  let sousTotal = produit.prix * data.quantite;
  if (data.livraison === 'domicile') {
    sousTotal = sousTotal + 25; 
  }
  if (data.options.includes('installation')) {
    sousTotal = sousTotal + 49; 
  }
  if (data.options.includes('garantie')) {
    sousTotal = sousTotal + 99; 
  }
  return Math.round(sousTotal * 113) / 100; 
}


const commandes = [];
async function lireCorps(req) {
  let corps = '';
  for await (const morceau of req) {
    corps += morceau;
  }
  return corps;
}


function envoyerJson(res, statut, donnees) {
  res.writeHead(statut, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(donnees));
}


const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const route = req.method + ' ' + url.pathname;
  console.log(route);

if (route === 'GET /api/produits') {
  return envoyerJson(res, 200, produits);
}
if (route === 'GET /api/commandes') {
  return envoyerJson(res, 200, commandes);
}

if (route === 'POST /api/commandes') {
  const data = JSON.parse(await lireCorps(req));
  const produit = produits.find((p) => p.id === data.produitId);
  const quantite = data.quantite;
  if (!data.nom || !data.courriel) {
    return envoyerJson(res, 400,
      { erreur: 'Nom et courriel obligatoires' });
  }
  if (data.livraison === 'domicile' && !data.adresse) {
    return envoyerJson(res, 400,
      { erreur: 'Adresse obligatoire' });
  }
  if (!Number.isInteger(quantite) || quantite < 1) {
  return envoyerJson(res, 400,
    { erreur: 'Quantité invalide' });
  }
  if (!produit) {
    return envoyerJson(res, 404,
      { erreur: 'Produit inconnu' });
  }
  if (quantite > produit.stock) {
    return envoyerJson(res, 409,
      { erreur: `Il ne reste que ${produit.stock} en stock` });
  }


  const commande = {
    id: commandes.length + 1,
    client: data.nom,
    courriel: data.courriel,
    produit: produit.nom,
    quantite: quantite,
    livraison: data.livraison,
    options: data.options,
    total: calculerTotal(produit, data),
    heure: new Date().toLocaleTimeString('fr-CA'),
  };
  commandes.push(commande);
  produit.stock = produit.stock - quantite;
  return envoyerJson(res, 201, commande);
}



  await servirFichier(res, url.pathname);
});

server.listen(3000, () => {
  console.log('Boutique Grand Nord : http://localhost:3000');
});
