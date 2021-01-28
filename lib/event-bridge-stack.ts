import { AppProps, Construct, Stack } from "@aws-cdk/core";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { EventBus, Rule } from "@aws-cdk/aws-events";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { LambdaRestApi } from "@aws-cdk/aws-apigateway";

export class EventBridgeStack extends Stack {
  constructor(scope: Construct, id: string, props?: AppProps) {
    super(scope, id, props);

    // Producer lambda
    const producerLambda = new Function(this, "producer-lambda", {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset("lambda-fns"),
      handler: "producer-lambda.handler",
    });

    producerLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ["*"],
        actions: ["events:PutEvents"],
      })
    );

    // Consumer lambda
    const consumerLambda = new Function(this, "consumer-lambda", {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset("lambda-fns"),
      handler: "consumer-lambda.handler",
    });

    // API Gateway
    const api = new LambdaRestApi(this, `lambda-rest-api`, {
      handler: producerLambda,
      proxy: false,
    });

    api.root.addResource("producer").addMethod("POST");

    // Eventbus
    const eventBus = new EventBus(this, "event-bus", {
      eventBusName: `event-bus`,
    });

    const eventRule = new Rule(this, "event-bus-rule", {
      eventBus: eventBus,
      eventPattern: {
        source: ["custom.producer-lambda"],
        detailType: ["create"],
      },
    });

    eventRule.addTarget(new LambdaFunction(consumerLambda));
  }
}
