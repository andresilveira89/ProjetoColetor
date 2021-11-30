const fins = require("../lib/index");
// const sqlite = require('sqlite3').verbose()
// const db = new sqlite.Database('dados.db')

// db.serialize(function () {
//     db.run("CREATE TABLE VALORES (Nome TEXT, Valor INT)")
// })
// db.close

const debug = false;
const opcoes = { timeout: 10000 };
const clientes = [];
const respostas = [];

const remoteHosts = {
  "192.168.250.2": "casa1",
  "192.168.250.4": "casa2"
  //Colocar os outros IP's aqui nessa lista e adicionar o nome de cada IP
};
// function RegistroDB(sql){
//     db.serialize(function () {
//         const conexo = db.run(sql)
//         conexo.finalize()
//     })
// }

function Retorno(responses) {
  console.log("All responses and or timeouts received");
  for (const item in responses){

      const valor = responses[item][0]
      const valor1 = responses[item][1]
      const valor2 = responses[item][2]
      const valor3 = responses[item][3]
      const Nome = remoteHosts[item]
      console.log(`IP: ${item}, NOME: ${Nome}, VALOR: ${valor} ${valor1} ${valor2} ${valor3}`)
//     const sql = `INSERT INTO VALORES VALUES (${Nome}, ${valor}, ${valor1}, ${valor2}, ${valor3})`
// const db = new sqlite.Database('dados.db')
//     RegistroDB(sql)
  }
}

function pollUnits() {
  for (const host in remoteHosts) {
    const indiceClientes = clientes.length;

    clientes[indiceClientes] = fins.FinsClient(9600, host, opcoes);

    clientes[indiceClientes].on("reply", function (mensagem) {
      respostas[mensagem.remotehost] = mensagem.values;

      const quantidade_respostas = Object.keys(respostas).length
      const quantidade_hosts = Object.keys(remoteHosts).length;

      if (quantidade_respostas == quantidade_hosts) {
        console.log(respostas)
        // Retorno(respostas);
      }

      if (debug) {
        console.log("Got reply from: ", mensagem.remotehost);
      }
    });

    clientes[indiceClientes].on("timeout", function (host) {
      const quantidade_respostas = Object.keys(respostas).length;
      const quantidade_hosts = Object.keys(remoteHosts).length;

      respostas[host] = null;

      if (quantidade_respostas == quantidade_hosts) {
        console.log(respostas)
      }
      if (debug) {
        console.log("Got timeout from: ", host);
      }
    });

    clientes[indiceClientes].on("error", function (error) {
      console.log("Error: ", error);
    });

    //clientes[indiceClientes].read("D00100", 1);

    /* Read WORDS or BITS from multiple memory address in one command */
    clientes[indiceClientes].readMultiple('D00100','D00101','D00102','D00103');
  }
}

console.log("Starting.....");
let intervalo = 3000

setInterval(() => {
    pollUnits()
}, intervalo);