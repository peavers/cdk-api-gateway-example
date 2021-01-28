exports.handler = async function (event) {
  console.log("Consumer: ", JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  };
};
