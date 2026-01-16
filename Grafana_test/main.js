//Le fichier est lu
alert("Opérationnel");

function recup_data(){

    let data_query = [];
    var tot_data_query = 0;

    for (let i = 1; i <= 7; i++) {
        data_query[i] = document.getElementById('B'+(i)+'_value').value;
        tot_data_query = tot_data_query+ "','" + data_query[i];
    }

    tot_data_query = "'" + tot_data_query + "'";
    tot_data_query = tot_data_query.substring(4,tot_data_query.length);

    if (!tot_data_query.includes("''")){
      /*
      Impossible de transmettre de la data simplement en envoyant les valeurs récupérées avec la méthode document.get dans
      une variable et venir écrire dans la fonction qui sera appellée lors d'une requête api ("test").
      On doit directement transmettre cette donnée par le biais de notre requête API.
      */
      fetch("http://localhost:3333/query/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tot_data_query}),
      })
      //forme voulue pour la réponse du serveur (en .json)
        //Si la fonction c'est executer avec succès
        .then((res) => res.json())
        .then(() => alert("Résultats envoyés"))
        .then((data) => console.log("Résultat serveur :", data))
        //Si la fonction a rencontré une erreur 
        .catch((err) => console.error("Erreur :", err));

    } else { alert("Veuillez compléter tout les champs");}

}


