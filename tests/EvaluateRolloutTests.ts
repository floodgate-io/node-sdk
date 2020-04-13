import { expect, assert } from "chai";
import 'mocha';
import * as floodgateClient from "../src/index";
import data from "./test-config";

describe('Test Rollouts', () => {
  const config = {
    localConfigData: data,
    consoleLog: false,
    refreshInterval: 3600
  };

  it('should return red', (done) => {
    const def = "grey";
    const exp = "red";

    const client = floodgateClient.createAutoUpdateClient("invalid", config);

    const user = floodgateClient.createUser("a9ac317e-6510-4903-9a42-e43d775b816d");

    client.on('ready', function() {
      let key = 'rollout-colours';
      const colour = client.GetValue(key, def, user);
      expect(colour).to.equal(exp); 
      done();
    });
  });

  it('should return green', (done) => {
    const def = "grey";
    const exp = "green";

    const client = floodgateClient.createAutoUpdateClient("invalid", config);

    const user = floodgateClient.createUser("a8ca3305-d4fc-4865-ae75-72edb8949244");

    client.on('ready', function() {
      let key = 'rollout-colours';
      const colour = client.GetValue(key, def, user);
      expect(colour).to.equal(exp); 
      done();
    });
  });

  it('should return yellow', (done) => {
    const def = "grey";
    const exp = "yellow";

    const client = floodgateClient.createAutoUpdateClient("invalid", config);

    const user = floodgateClient.createUser("ec144edb-7102-4091-ae1a-0d7b5f74707a");

    client.on('ready', function() {
      let key = 'rollout-colours';
      const colour = client.GetValue(key, def, user);
      expect(colour).to.equal(exp); 
      done();
    });
  });

  it('should return orange', (done) => {
    const def = "grey";
    const exp = "orange";

    const client = floodgateClient.createAutoUpdateClient("invalid", config);

    const user = floodgateClient.createUser("1fa1cc72-6463-47d8-87df-a05a4e832dba");

    client.on('ready', function() {
      let key = 'rollout-colours';
      const colour = client.GetValue(key, def, user);
      expect(colour).to.equal(exp); 
      done();
    });
  });

  it('should return blue', (done) => {
    const def = "grey";
    const exp = "blue";

    const client = floodgateClient.createAutoUpdateClient("invalid", config);

    const user = floodgateClient.createUser("7af3cd58-dc5b-4d53-982b-4892fd9b7df2");

    client.on('ready', function() {
      let key = 'rollout-colours';
      const colour = client.GetValue(key, def, user);
      expect(colour).to.equal(exp); 
      done();
    });
  });
});