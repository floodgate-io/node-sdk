import { expect, assert } from 'chai';
import 'mocha';
import * as floodgateClient from "../src/index";
import data from "./test-config";

describe('Test Targets', () => {
  const config = {
    localConfigData: data,
    consoleLog: false,
    refreshInterval: 3600
  };

  context('Equal To', () => {
    it('should return yellow', (done) => {
      const def = "grey";
      const exp = "yellow";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const attributes = {
        Name: "Peter Parker",
        Country: "US"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", attributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });

    it('no user attributes should return red', (done) => {
      const def = "grey";
      const exp = "red";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b");

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });

    it('no matching user attributes should return red', (done) => {
      const def = "grey";
      const exp = "red";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Age: "20"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Not Equal To', () => {
    it('should return orange', (done) => {
      const def = "grey";
      const exp = "orange";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Name: "Bruce Banner"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Greater Than', () => {
    it('should return blue', (done) => {
      const def = "grey";
      const exp = "blue";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Score1: "45"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Greater Than and Equal To', () => {
    it('should return green', (done) => {
      const def = "grey";
      const exp = "green";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Score2: "135"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Less Than', () => {
    it('should return yellow', (done) => {
      const def = "grey";
      const exp = "yellow";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Score3: "35"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Less Than and Equal To', () => {
    it('should return blue', (done) => {
      const def = "grey";
      const exp = "blue";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Score4: "120"
      };
      
      const user = floodgateClient.createUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", "spiderman@marvel.com", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Contains with Old User Object', () => {
    it('should return green', (done) => {
      const def = "grey";
      const exp = "green";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Age: "25"
      };
      
      const user = floodgateClient.createUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", "random@gmail.com", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Contains with New User Object', () => {
    it('should return green', (done) => {
      const def = "grey";
      const exp = "green";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Email: "random@gmail.com"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Not Contain with Old User Object', () => {
    it('should return yellow', (done) => {
      const def = "grey";
      const exp = "yellow";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Age: "30"
      };
      
      const user = floodgateClient.createUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", "random@yahoo.co.uk", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Not Contain with New User Object', () => {
    it('should return yellow', (done) => {
      const def = "grey";
      const exp = "yellow";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Email: "random@yahoo.co.uk"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

  context('Ends With', () => {
    it('should return yellow', (done) => {
      const def = "grey";
      const exp = "yellow";

      const client = floodgateClient.createAutoUpdateClient("invalid", config);

      const customAttributes = {
        Country: "United Kingdom"
      };
      
      const user = floodgateClient.createFloodgateUser("d2405fc0-c9cd-49e7-a07e-bf244d6d360b", customAttributes);

      client.on('ready', function() {
        let key = 'colours';
        const colour = client.GetValue(key, def, user);
        expect(colour).to.equal(exp); 
        done();
      });
    });
  });

});