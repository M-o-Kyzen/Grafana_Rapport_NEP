const express = require("express");
const router = express.Router();
const { executeQuery } = require("../db.js");

//Lorsque l'on vient intérroger  notre serveur avec cette route là, c'est son contenu qui est renvoyé
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
  
	var tot_data_query = JSON.stringify(req.body);
	console.log("\nDonnées avant mise en forme:", tot_data_query,"\n");
	
	//formatage JSON -> DATA SQL
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

	tot_data_query = actual.substring(1,actual.length).replaceAll('"',"'")
	
	console.log("\nDonnées après mise en forme:", tot_data_query,"\n");
	
  //Définition de la requête SQL
  const query = "INSERT INTO Grafana (DateHeure,Type_de_Cycle,Matériel,Groupe_NEP,Test_bandelette,Siropeur,Rincage_Final) VALUES ("+tot_data_query+")";
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

//On exporte la configuration de la route (allQuery) pour notre requête http
module.exports = { router };
console.log("QUERY OK");