const express = require("C:/Users/keskinmt/Documents/Grafana_dev/Grafana_embed/SQL/node_modules/express");
//Création d'une application pour permettre de créer notre environnement SQL (serveur pour envoyer une requête, lein avec la base...)
const app = express();
const port = 3333;

const cors = require("C:/Users/keskinmt/Documents/Grafana_dev/Grafana_embed/SQL/node_modules/cors");
//Mise en forme du payload
const bodyParser = require("C:/Users/keskinmt/Documents/Grafana_dev/Grafana_embed/SQL/node_modules/body-parser");
//Récupération de la config
const { connect } = require("C:/Users/keskinmt/Documents/Grafana_dev/Grafana_embed/SQL/db.js");
//On définie l'accès au fichier où on définie notre réponse http
const queryRoutes = require("C:/Users/keskinmt/Documents/Grafana_dev/Grafana_embed/SQL/routes/query.js");

//Les domaines/méthodes/headers autorisés à communiquer avec le serveur
app.use(cors(
{
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
}));


//On définit les headers de cache et HTML ici car on ne peut pas les définir directement dans la config cors
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  //Affichage des Headers côté client
  console.log("\nEn-têtes définis :",res.getHeaders());
  next();
});

//Expéditeur de la requête
app.use((req, res, next) => {
  console.log('\nExpéditeur:', req.headers.origin,"\n");
  next();
});

//Mise en forme du payload reçu sous forme d'un JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connexion à la base de données 
connect()
  .then((connection) => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.log("Database connection failed!");
    console.log(error);
  });

//on définie l'accès aux routes céées dans le fichier query
app.use("/query", queryRoutes.router);
/*
Lors de l'appel de notre requête, on précise bien la route du fichier
 en plus de celle de la réponse créee dans ce fichier, donc test
*/

//méthode get pour tester
app.get("/ok", (req, res) => {
  res.send("Serveur OK");
  console.log("OK envoyé");
});

//C'est sur ce port que notre serveur que notre application se lance, on rajoute 0.0.0.0 pour s'assurer qu'elle n'écoute pas que en local mais aussi sur le réseau
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

//Ouverture du port vers le réseau : New-NetFirewallRule -DisplayName "Ouvrir Port 3333" -Direction Inbound -LocalPort 3333 -Protocol TCP -Action Allow
//Supprimer la règle : Remove-NetFirewallRule -DisplayName "Ouvrir Port 3333"
//Checker si un port est accessible sur une machine : Test-NetConnection -ComputerName 10.17.18.2 -Port 3333