var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));

var englishLanguageCode = "en";

exports.lambdaHandler = async (event, context) => {
    try {
        AWS.config.update({region: process.env.AWS_REGION});
        console.log(JSON.stringify(event));

        let languageCode = event.queryStringParameters.languageCode;
        let appConfig = await getAppConfigForLanguageCode(languageCode);

        if (appConfig.Items.length === 0){
            // get english app config and translate to language code requested and store in dynamodb
            console.log("No app config found for language code " + languageCode + ", building one now");
            let englishAppResponse = await getAppConfigForLanguageCode(englishLanguageCode);
            console.log("Found english app config " + JSON.stringify(englishAppResponse));
            let englishAppConfig = englishAppResponse.Items[0];
            let translatedSourceLabel = await translateText(englishAppConfig.sourceLabel.S, englishLanguageCode, languageCode);
            let translatedTargetLabel = await translateText(englishAppConfig.targetLabel.S, englishLanguageCode, languageCode);
            let translatedTextToTranslatePlaceholder = await translateText(englishAppConfig.textToTranslatePlaceholder.S, englishLanguageCode, languageCode);
            let translatedTranslateButtonText = await translateText(englishAppConfig.translateButtonText.S, englishLanguageCode, languageCode);
            let translatedUpdateWebsiteLanguageButtonText = await translateText(englishAppConfig.updateWebsiteLanguageButtonText.S, englishLanguageCode, languageCode);
            let translatedWebsiteLanguageSelectionLabel = await translateText(englishAppConfig.websiteLanguageSelectionLabel.S, englishLanguageCode, languageCode);
            let translatedTranslateLimitExceededText = await translateText(englishAppConfig.translateLimitExceededText.S, englishLanguageCode, languageCode);
            let enOptions = englishAppConfig.options.L;
            let translatedOptions = [];
            for (let enOption of enOptions) {
                let translatedLanguageLabel = await translateText(enOption.M.label.S, englishLanguageCode, languageCode);
                translatedOptions.push({
                    code: enOption.M.code.S,
                    label: translatedLanguageLabel
                });
            }
            await addAppConfig(languageCode, translatedSourceLabel, translatedTargetLabel, translatedTextToTranslatePlaceholder, translatedTranslateButtonText, translatedOptions, translatedUpdateWebsiteLanguageButtonText, translatedWebsiteLanguageSelectionLabel, translatedTranslateLimitExceededText);
            appConfig = await getAppConfigForLanguageCode(languageCode);
        }

        return respond(appConfig);
    } catch (err) {
        console.log(err);
        return error(err);
    }
};

async function getAppConfigForLanguageCode(languageCode){
    let dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    let queryParams = {
        ExpressionAttributeValues: {
            ":id": {
                S: languageCode
            }
        },
        KeyConditionExpression: "id = :id",
        TableName: process.env.APP_CONFIG_TABLE_NAME
    }
    console.log("Querying app config table with params " + JSON.stringify(queryParams));
    return await dynamoDb.query(queryParams).promise();
}

async function translateText(text, sourceLanguageCode, targetLanguageCode) {
    let translate = new AWS.Translate({apiVersion: '2017-07-01'});
    console.log("Translated text " + text + " with source " + sourceLanguageCode + " and target " + targetLanguageCode);
    var params = {
        SourceLanguageCode: sourceLanguageCode,
        TargetLanguageCode: targetLanguageCode,
        Text: text,
    };
    let translatedTextResponse = await translate.translateText(params).promise();
    return translatedTextResponse.TranslatedText;
}

async function addAppConfig(languageCode, sourceLabel, targetLabel, textToTranslatePlaceholder, translateButtonText, options, translatedUpdateWebsiteLanguageButtonText, translatedWebsiteLanguageSelectionLabel, translatedTranslateLimitExceededText) {
    let dynamoDb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    let optionsArray = [];
    for (let option of options) {
        optionsArray.push({
            M: {
                "code": {
                    S: option.code
                },
                "label": {
                    S: option.label
                }
            }
        })
    }
    let createItemParams = {
        TableName: process.env.APP_CONFIG_TABLE_NAME,
        Item: {
            "id": {
                S: languageCode
            },
            "sourceLabel": {
                S: sourceLabel
            },
            "targetLabel": {
                S: targetLabel
            },
            "textToTranslatePlaceholder": {
                S: textToTranslatePlaceholder
            },
            "translateButtonText": {
                S: translateButtonText
            },
            "updateWebsiteLanguageButtonText": {
                S: translatedUpdateWebsiteLanguageButtonText
            },
            "websiteLanguageSelectionLabel": {
                S: translatedWebsiteLanguageSelectionLabel
            },
            "translateLimitExceededText": {
                S: translatedTranslateLimitExceededText
            },
            "options": {
                L: optionsArray
            }
        }, 
    }
    console.log("Adding app config with params " + JSON.stringify(createItemParams));
    await dynamoDb.putItem(createItemParams).promise();
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