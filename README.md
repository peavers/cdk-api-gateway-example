# API Gateway -> Lambda -> EventBridge -> Lambda

A simple CDK typescript template/test project for a basic flow.

## Run

```bash
npm i && cdk deploy
```

Copy the endpoint url from the result of the above command and make a `POST` request to `https://<YOUR_ENDPOINT>.amazonaws.com/prod/produce` with `JSON` content body.

Example:
```bash
curl --location --request POST 'https://qdje2uugu6.execute-api.eu-west-1.amazonaws.com/prod/produce' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Hello world"
}'
```

## Cleanup

```bash
cdk destroy
```
