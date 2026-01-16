const sql = require("mssql");

const config = {
  //Server=localhost\SQLEXPRESS01;Database=master;Trusted_Connection=True;
  //S'assurer que la connexio a bien l'option "sysadmin" activée
  server: "WFRVOLCORTEX",
  database: "Siroperie",
  user: "matteo",
  password: "102003",
  //port: "1433"
  options: {
    //instanceName: 'SQLEXPRESS', // On ne peut pas directement précisé "Matteo\SQLEXPRESS" donc on renseigne le nom du serveur "Matteo" et ici l'instance
    trustedConnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

//Vérification de l'écoute du port 1433 : netstat -an | findstr 1433

// Fonction gérant l'envoei de notre query
async function executeQuery(query, values = [], paramNames = [], isStoredProcedure = true, outputParamName = null) {
    /*L'envoie de la requête est dans une boucle try pour éviter le crach de tout le programme.
      On utilise await pour que la boucle choppe l'erreur en cas d'erreur car la boucle try ne fonctionne
      qu'en asynchrone. On utilise la méthode throw pour être sûr que l'execution du code ne soit pas ralenti.
    */
    try {
      const pool = await sql.connect(config);
      const request = pool.request();
  
      if (values && paramNames) {
        for (let i = 0; i < values.length; i++) {
          request.input(paramNames[i], values[i]);
        }
      }
  
      // Handle output parameter
      if (outputParamName) {
        request.output(outputParamName, sql.Int);
      }
      
      // console.log("VALUES ", values);
      // console.log("PARAM ", paramNames);
      // console.log("QUERY " , query);
      // console.log("REQUEST ", request.parameters);
      values.forEach((val, index) => {
        if (typeof val === 'undefined') {
          console.error(`Undefined value found for ${paramNames[index]}`);
        }
      });
      
      let result;
      if (isStoredProcedure) {
        result = await request.execute(query);
      } else {
        result = await request.batch(query);
      }
  
      if (outputParamName) {
        result = { ...result, [outputParamName]: request.parameters[outputParamName].value };
      }
  
      return result;
    
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  // Bulk queries handled here
  async function executeTableValuedQuery(query, table, paramNames = [], isStoredProcedure = true, outputParamName = null) {
    try {
      const pool = await sql.connect(config);
      const request = pool.request();
  
      // Setting the table-valued parameter
      if (table instanceof sql.Table) {
        request.input(paramNames, table);
      }
  
      // Handle output parameter
      if (outputParamName) {
        request.output(outputParamName, sql.Int);
      }
  
      let result;
      if (isStoredProcedure) {
        result = await request.execute(query);
      } else {
        result = await request.batch(query);
      }
  
      if (outputParamName) {
        result = { ...result, [outputParamName]: request.parameters[outputParamName].value };
      }
      
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

//Importation de la configuration permettant l'envoie de notre requête à notre DB
module.exports = {
  connect: () => sql.connect(config),
  sql,
  executeQuery,
  executeTableValuedQuery
};
console.log("DB OK");