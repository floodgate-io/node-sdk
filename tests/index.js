var floodgate = require("../dist/index");

const config = {
  consoleLog: false,
  refreshInterval: 10
};
const client = floodgate.createAutoUpdateClient("2d414c28563b9788a47e5062fe9a57fd86efe69c28a31ea4aaada43cac87", config);

client.on('ready', function() {
  const colour = client.GetValue('button-colour', 'grey');

  console.log(`colour = ${colour}`);

  const colour2 = client.GetValue('button-colour', 'grey');

  console.log(`colour = ${colour2}`);

  const colour3 = client.GetValue('button-colour', 'grey');

  console.log(`colour = ${colour3}`);

  const colour4 = client.GetValue('button-colour', 'grey');

  console.log(`colour = ${colour4}`);
});