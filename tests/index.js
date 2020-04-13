var floodgate = require("../dist/src/index");

const config = {
  consoleLog: true,
  refreshInterval: 10
};
const client = floodgate.createClient("2d414c28563b9788a47e5062fe9a57fd86efe69c28a31ea4aaada43cac87", config);

client.on('ready', function() {
  const colour = client.GetValue('button-colour', 'grey');

  console.log(`colour = ${colour}`);
});