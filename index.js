const pollUnits = require("./public/observadores").connect.pollUnits

const remoteHosts = {
  "192.168.250.2": {Nome: "casa1"}, 
  "192.168.250.4": {Nome: "casa2"}
  //Colocar os outros IP's aqui nessa lista e adicionar o nome de cada IP
}

const intervalo = 5000 //Intervalo de repetição

setInterval(() => {
  pollUnits({remoteHosts: remoteHosts})
}, intervalo)
