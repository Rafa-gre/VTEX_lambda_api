## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- NodeJS
- React
- Express
- DynamoDB
- AWS Amplify
- AWS API Gateway
- VTEX.IO API

## 💻 Projeto
O projeto consiste em uma função AWS Lambda que recebe através da API OrderHook da VTEX um JSON contendo o número do pedido,
em seguida com esse dado consulta o email do cliente através da API conversation, de posse do email consultamos a tabela de Leads no DynamoDB e 
alteramos o status do campo client de false para true,com isso conseguimos de forma automatizada saber a conversão dos leads em clientes

## :lock: VTEX-APIs

#ORDER HOOK API

  https://developers.vtex.com/vtex-rest-api/reference/order-hook-1#hookconfiguration
  
#CONVERSATION API

  https://developers.vtex.com/vtex-rest-api/reference/conversation
