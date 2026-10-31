
if (route === 'GET /api/commandes') {
  return envoyerJson(res, 200, commandes);
}
const liste = document.querySelector('#commandes');
async function chargerCommandes() {
  const response = await fetch('/api/commandes');
  const commandes = await response.json();
  liste.textContent = '';
  for (const c of commandes) {
    const li = document.createElement('li');
    li.textContent = `#${c.id} · ${c.client} : ${c.quantite} × `
      + `${c.produit} · ${c.livraison} = ${c.total.toFixed(2)} $`;
    liste.prepend(li);
  }
}

const ventes = document.querySelector('#ventes'); // en haut
async function chargerCommandes() {
  // ... fetch et vider la liste : ne change rien
  let total = 0;
  for (const c of commandes) {
    // ... le <li> : ne change rien
    total = total + c.total;
  }
  ventes.textContent = `Ventes du jour : ${total.toFixed(2)} $`;
}
chargerCommandes();
setInterval(chargerCommandes, 5000);

chargerCommandes();
