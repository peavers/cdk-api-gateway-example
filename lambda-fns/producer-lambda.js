const AWS = require("aws-sdk");
const eventbridge = new AWS.EventBridge();

exports.handler = async function(event) {

  console.log("Raw event: ", event);

  const data = {
    Entries: [
      {
        Source: "custom.producer-lambda",
        EventBusName: "event-bus",
        DetailType: "create",
        Time: new Date(),
        Detail: event.body
      }
    ]
  };

  console.log("Producer: ", data);

  await eventbridge.putEvents(data).promise();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
};
