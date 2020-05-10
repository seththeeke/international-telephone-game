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
        console.log(text + " " + sourceLanguageCode + " " + targetLanguageCode);
        var params = {
            SourceLanguageCode: sourceLanguageCode,
            TargetLanguageCode: targetLanguageCode,
            Text: requestBody.text,
        };
        let translatedText = await translate.translateText(params).promise();
        return respond(translatedText);
    } catch (err) {
        console.log(err);
        return error(err);
    }
};

function respond(requestId){
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            'data': requestId
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