const express = require("express");
const router = express.Router();
const { executeQuery } = require("../db.js");

//Test bandelette
router.post("/test", async (req, res) => {
	
  //lecture de la donnée envoyée par le client
  //var { tot_data_query } = req.body;
   
  // Juste pour debug — log côté serveur
	console.log("Reçu du client :", req.body);

  // définition de la réponse server qui sert lorsque on demande une réponse côté client
  res.json({
    success: true,
    message: "Données reçues",
    data: req.body
  });

  //Définition de la requête SQL
  const query = "INSERT INTO Test_Bandelette (DateHeure,Type_de_Cycle,Matériel,Groupe_NEP,Test_bandelette,Siropeur,Rincage_Final) VALUES ("+JSON_to_SQLDATA(JSON.stringify(req.body))+")";
  const values = [];
  const paramNames = [];
  const isStoredProcedure = false;
  try {
    const result = await executeQuery(
      query,
      values,
      paramNames,
      isStoredProcedure
    );
    //Le serveur envoie les résultat de notre requête au client.
    //res.send(result.recordset);
  } catch (error) {
    console.error(error);
    //Réponse
    res.status(500).send(error);
  }

});

//Commentaire
router.post("/com", async (req, res) => {
	
  //lecture de la donnée envoyée par le client
  //var { tot_data_query } = req.body;
   
  // Juste pour debug — log côté serveur
	console.log("Reçu du client :", req.body);

  // définition de la réponse server qui sert lorsque on demande une réponse côté client
  res.json({
    success: true,
    message: "Données reçues",
    data: req.body
  });
 
  //Définition de la requête SQL
  const query = "INSERT INTO Commentaire (DateHeure,Materiel,Groupe_NEP,Siropeur,Commentaire) VALUES ("+JSON_to_SQLDATA(JSON.stringify(req.body))+")";
  const values = [];
  const paramNames = [];
  const isStoredProcedure = false;
  try {
    const result = await executeQuery(
      query,
      values,
      paramNames,
      isStoredProcedure
    );
    //Le serveur envoie les résultat de notre requête au client.
    //res.send(result.recordset);
  } catch (error) {
    console.error(error);
    //Réponse
    res.status(500).send(error);
  }

});

//On exporte l'objet router qui contient les endpoints
module.exports = { router };

//formatage JSON -> DATA SQL
function JSON_to_SQLDATA(tot_data_query) {
	
	console.log("\nDonnées avant mise en forme:", tot_data_query,"\n");
	
	var TabString = tot_data_query.split(",");
	var Tab2String = [];
	var buffer = "";
	var actual = "";
	var cpt = 0;

	//Mise en forme JSON -> Données pour requête SQL
	for (let i = 0; i < TabString.length; i++) {
		TabString[i] = TabString[i].replace(":",",");
		buffer = buffer + "," + TabString[i]
	}

	buffer = buffer.substring(2,buffer.length-1)
	Tab2String = buffer.split(",");

	for (let i = 0; i < Tab2String.length; i++) {
    
	  if (cpt%2 == 0){
		  Tab2String[i] = ",";
	  }
	    cpt = cpt + 1;
	}

	for (let i = 0; i < Tab2String.length; i++) {
		actual = actual + Tab2String[i];
	}

	tot_data_query = actual.substring(1,actual.length).replaceAll('"',"'");
	
	console.log("\nDonnées après mise en forme:", tot_data_query,"\n");
	
  return tot_data_query;
	
}

console.log("QUERY OK");