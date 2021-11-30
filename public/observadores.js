const gerencia = require("./multpleClients.js").connect

function Data(){
    const data = new Date();
    const dia = String(data.getDay()).padStart(2, '0')
    const mes = String(data.getMonth()).padStart(2, '0')
    const ano = String(data.getFullYear()).padStart(2, '0')
    const hora = String(data.getHours()).padStart(2, '0')
    const minuto = String(data.getMinutes()).padStart(2, '0')

    return `${dia}/${mes}/${ano} ${hora}:${minuto}`
}

function Resposta(responses) {
    const respostas = responses.respostas
    const remoteHosts = responses.remoteHosts

    console.log("----------------------------")
    for (const item in respostas){
        const valor = respostas[item][0]
        const valor1 = respostas[item][1]
        const valor2 = respostas[item][2]
        const valor3 = respostas[item][3]
        const Nome = remoteHosts[item].Nome
        const Status = remoteHosts[item].Status
        const data = Data()

        if(Status == 'online'){
            console.log(`IP: ${item}, NOME: ${Nome}, VALOR: ${valor} ${valor1} ${valor2} ${valor3} - ${data}`)
        }else if (Status == "offline") {
            console.log(`IP: ${item}, NOME: ${Nome} ESTÁ DESCONECTADO - ${data}`)
        }

    }
    console.log("----------------------------")
}

gerencia.Inscricao(Resposta)

exports.connect = {
    pollUnits: gerencia.pollUnits
}