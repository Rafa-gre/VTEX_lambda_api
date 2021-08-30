const AWS = require('aws-sdk');
const fetch = require('node-fetch');

AWS.config.update({
    region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamoTableName = 'AWS_order';
const order = "/VTEX-API-Mail";
const checkEmail = "/VTEX-API-Mail/checkEmail";

exports.handler = async function (event) {
    console.log('Request Event', event);
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.path === order:
            response = buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === order:
            response = await newOrder(JSON.parse(event.body));
            break;
        case event.httpMethod === 'PUT' && event.path === checkEmail:
            response = await getEmail(JSON.parse(event.body));
            break;
    }
    return response;
};


async function newOrder(requestBody) {
    const orderId = {
        orderId: requestBody.OrderId.toString()
    }
    const params = {
        TableName: dynamoTableName,
        Item: orderId
    };
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: "Cadastro de Pedido",
            Message: "Salvo com Sucesso :D",
            Item: requestBody
        };
        return getEmail(orderId);
    }, (error) => {
        console.error("Incapaz de armazenar o pedido", error);
    });
}

async function getEmail(requestBody) {
    const order_data = requestBody.orderId;
    let email = "";
    const url = `https://hiringcoders202114.vtexcommercestable.com.br/api/oms/pvt/orders/${order_data}/conversation-message`;
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': 'vtexappkey-hiringcoders202114-IUCZYX',
            'X-VTEX-API-AppToken': 'EIXIFXLUMSTBWXNDTWEIJQISTOLISRMEDCLRKMCVQMKBKIWWRGIVTCFOAEORLCBVGPYTLVSGTIRWFGIKRPRMIQLAXWRFXKJOLOVVKDKVNBBLLIITWEZWLOMPEXWOEMIJ'
        }
    };

    await fetch(url, options)
        .then(res => res.json())
        .then(json => {
            console.log(json[0].to[0].email);
            email = json[0].to[0].email;
        })
        .catch(err => console.error('error:' + err));
    return await checkCliente(email);
}

async function checkCliente(email) {
    const params = {
        TableName: "Leads",
        Key: {
            'email': email
        },
        UpdateExpression: `set cliente = :cliente`,
        ExpressionAttributeValues: {
            ':cliente': true,
        },
        ReturnValues: 'UPDATED_NEW'
    };

    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'Atualização de Prospecto',
            Message: "Atualizado com sucesso!",
            Item: response
        };
        return buildResponse(200, body);
    }, (error) => {
        console.error("Incapaz de atualizar Prospecto", error);
    });
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}