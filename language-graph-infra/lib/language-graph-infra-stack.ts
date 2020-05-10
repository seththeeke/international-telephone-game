import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import path = require('path');

export class LanguageGraphInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amazonTranslateLimitTable = new dynamodb.Table(this, "AmazonTranslateLimitTable", {
      partitionKey: {
        name: "month",
        type: dynamodb.AttributeType.NUMBER
      },
      tableName: "AmazonTranslateLimitTable",
      readCapacity: 1,
      writeCapacity: 1
    });

    const translateLambda = new lambda.Function(this, "TranslateLambda", {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../translate-lambda')),
      handler: "app.lambdaHandler",
      runtime: lambda.Runtime.NODEJS_12_X,
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(120),
      functionName: "TranslateLambda",
      description: "Translates text from one language to another",
      environment: {
        "AMAZON_TRANSLATE_LIMIT_TABLE_NAME": amazonTranslateLimitTable.tableName,
        "AMAZON_TRANSLATE_MONTHLY_CHARACTER_LIMIT": "1000000"
      }
    });

    const translatePolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      effect: iam.Effect.ALLOW,
      resources: ["*"]
    });

    translateLambda.addToRolePolicy(translatePolicy);
    amazonTranslateLimitTable.grantFullAccess(translateLambda);

    const publicApiGateway = new apigateway.RestApi(this, "PublicApi", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      }
    });
    publicApiGateway.root.addMethod('ANY');

    const translateLambdaResource = publicApiGateway.root.addResource('translate');
    const translateLambdaIntegration = new apigateway.LambdaIntegration(translateLambda);
    translateLambdaResource.addMethod('PUT', translateLambdaIntegration);
  }
}
