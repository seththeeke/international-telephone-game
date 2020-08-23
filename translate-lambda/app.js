var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));

exports.lambdaHandler = async (event, context) => {
    try {
        AWS.config.update({region: process.env.AWS_REGION});
        let translate = new AWS.Translate({apiVersion: '2017-07-01'});
        let requestBody = JSON.parse(event.body);
        let text = requestBody.text;
        let sourceLanguageCode = requestBody.sourceLanguageCode || "auto";
        let targetLanguageCode = requestBody.targetLanguageCode;

        let canMakeRequestResult = await canMakeRequest(text);
        console.log("Make request resulted in " + JSON.stringify(canMakeRequestResult));
        if (!canMakeRequestResult) {
            return error("Request exceeds amazon translate limit for text " + text);
        }

        var params = {
            SourceLanguageCode: sourceLanguageCode,
            TargetLanguageCode: targetLanguageCode,
            Text: requestBody.text,
        };
        let translatedText = await translate.translateText(params).promise();
        return respond({
            translatedText: translatedText,
            canMakeRequestResult: canMakeRequestResult
        });
    } catch (err) {
        console.log(err);
        return error(err);
    }
};

/**
 * Amazon Translate is expensive so this checks a table that stores a limited number of translations per month
 * and will deny the request if it reaches the limit, sorry but I'm not made of money...
 */
async function canMakeRequest(textToTranslate){
    console.log("Validating that translate request can be made for text " + textToTranslate);
    let amazonTranslateLimitTableName = process.env.AMAZON_TRANSLATE_LIMIT_TABLE_NAME;
    let amazonTranslateLimit = parseInt(process.env.AMAZON_TRANSLATE_MONTHLY_CHARACTER_LIMIT);
    let currMonth = new Date().getMonth();

    let dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    let scanParams = {
        TableName: amazonTranslateLimitTableName
    }
    let scanResult = await dynamoDb.scan(scanParams).promise();
    console.log("Received scan result for limit objects " + JSON.stringify(scanResult));
    let thisMonthsLimit = undefined;
    for (let item of scanResult.Items) {
        if (item.month.N !== currMonth.toString()) {
            let deleteParams = {
                Key: {
                    "month": {
                        N: item.month.N.toString()
                    }
                }, 
                TableName: amazonTranslateLimitTableName
            }
            console.log("Deleting row with params " + JSON.stringify(deleteParams));
            await dynamoDb.deleteItem(deleteParams).promise();
        } else {
            thisMonthsLimit = item;
        }
    }
    console.log("Received scan result from initial limit check " + JSON.stringify(thisMonthsLimit));
    if (!thisMonthsLimit){
        console.log("No limit yet created for this month, creating one now for month " + currMonth);
        let createItemParams = {
            TableName: amazonTranslateLimitTableName,
            Item: {
                "month": {
                    N: currMonth.toString()
                },
                "characterCount": {
                    N: "0"
                }
            }, 
        }
        console.log("Creating limit object with params " + JSON.stringify(createItemParams));
        let newLimitResult = await dynamoDb.putItem(createItemParams).promise();
        thisMonthsLimit = {
            "month": {
                N: currMonth.toString()
            },
            "characterCount": {
                N: "0"
            }
        };
    }

    console.log("Current month's limit is " + JSON.stringify(thisMonthsLimit));
    if (parseInt(thisMonthsLimit.characterCount.N) + textToTranslate.length > amazonTranslateLimit){
        console.log("Request would exceed limit for amazon translate requests for the month of " + currMonth);
        return false;
    }

    let updateItemParams = {
        TableName: amazonTranslateLimitTableName,
        Item: {
            "month": {
                N: currMonth.toString()
            },
            "characterCount": {
                N: (parseInt(thisMonthsLimit.characterCount.N) + textToTranslate.length).toString()
            }
        }, 
    }
    console.log("Updating limit object with params " + JSON.stringify(updateItemParams));
    await dynamoDb.putItem(updateItemParams).promise();
    return (parseInt(thisMonthsLimit.characterCount.N) + textToTranslate.length).toString();
}

function respond(responseData){
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            'data': responseData
        }),
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        }
    };
}

function error(message){
    console.log(message);
    return {
        'statusCode': 500,
        'body': JSON.stringify({
            'err': message
        }),
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        }
    };
}