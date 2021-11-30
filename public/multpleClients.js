const fins = require("./lib/index")
const start_observ = require("./observadores")

const debug = true;
const opcoes = { timeout: 10000 };
const clientes = [];
let respostas = [];

const observadores = []

function Inscricao(comando) {
  observadores.push(comando)
}

function Notificacao(comando) {
  for (const observador in observadores) {
    observadores[observador](comando)
  }
}

function LimparRespostas(){
  for (const resposta in respostas){
    delete respostas[resposta]
  }
}

function pollUnits(comando) {
  const remoteHosts = comando.remoteHosts
  LimparRespostas()
  for (const host in remoteHosts) {
    const indiceClientes = clientes.length;
    clientes[indiceClientes] = fins.FinsClient(9600, host, opcoes);

    clientes[indiceClientes].on("reply", function (mensagem) {
      respostas[mensagem.remotehost] = mensagem.values;

      remoteHosts[host].Status = "online"
      
      const quantidade_respostas = Object.keys(respostas).length
      const quantidade_hosts = Object.keys(remoteHosts).length;

      if (quantidade_respostas == quantidade_hosts) {
        Notificacao({ respostas: respostas, remoteHosts: remoteHosts });
      }
    })

    clientes[indiceClientes].on("timeout", function (host) {
      
      respostas[host] = false
      remoteHosts[host].Status = "offline"

      const quantidade_respostas = Object.keys(respostas).length
      const quantidade_hosts = Object.keys(remoteHosts).length;

      if (quantidade_respostas == quantidade_hosts) {
        Notificacao({ respostas: respostas, remoteHosts: remoteHosts });
      }
    })

    clientes[indiceClientes].readMultiple('D00100', 'D00101', 'D00102', 'D00103');
  }
}

exports.connect = {
  pollUnits,
  Inscricao
}