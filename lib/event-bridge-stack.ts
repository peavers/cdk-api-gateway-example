import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as events_targets from "@aws-cdk/aws-events-targets";
import { EventBus, Rule } from "@aws-cdk/aws-events";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { LambdaRestApi } from "@aws-cdk/aws-apigateway";

export class EventBridgeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.AppProps) {
    super(scope, id, props);

    // Producer lambda
    const producerLambda = new Function(this, "producer-lambda", {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset("lambda-fns"),
      handler: "producer-lambda.handler",
    });

    producerLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
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

    api.root.addResource("produce").addMethod("POST");

    // Eventbus
    const eventBus = new EventBus(this, "EventBus", {
      eventBusName: `event-bus`,
    });

    const eventRule = new Rule(this, "EventBusRule", {
      eventBus: eventBus,
      eventPattern: {
        source: ["custom.producer-lambda"],
        detailType: ["create"],
      },
    });

    eventRule.addTarget(new events_targets.LambdaFunction(consumerLambda));
  }
}
