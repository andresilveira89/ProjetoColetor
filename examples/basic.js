var fins = require('../lib/index');
var client = fins.FinsClient(9600, '192.168.250.2');

const espacos_memoria = {
  texto : [],
  num_reais : []
}

const conversoes = {
  textos : [],
  numeros : [] 
}

function ConversaoHEX(espacos_memoria) {
  let hexadecimal = ""
  let bytes = []
  for (const indice in espacos_memoria.texto) {
    const valor = espacos_memoria.texto[indice]
    if (valor) {
      hexadecimal += parseInt(espacos_memoria.texto[indice], 10).toString(16)
      const primeiro = hexadecimal[0].toString() + hexadecimal[1].toString()
      const segundo = hexadecimal[2].toString() + hexadecimal[3].toString()
      bytes.push(primeiro)
      bytes.push(segundo)
      hexadecimal = ""
    }
  }
  let texto = ""
  for (const indice in bytes) {
    const valor = bytes[indice]
    if (valor != '00') {
      texto += String.fromCharCode(`0x${valor}`)
    }
  }
  return texto
}

function DivisaoeConversao(msg){
  for (const indice in msg.values){
    if (indice <= 6){
      espacos_memoria.texto.push(msg.values[indice])
    }
    else if (indice >= 7 && indice <= 9){
      espacos_memoria.num_reais.push(msg.values[indice])
    }
  }
  conversoes.textos.push(ConversaoHEX(espacos_memoria))
}

client.on('reply', function (msg) {
  DivisaoeConversao(msg)
  console.log(conversoes.textos)
});

console.log("Starting.....");
client.read('D200', 50)
