# Floodgate SDK for Node.js and Server Side Rendering (SSR)

## Overview

This is the Node.js SDK for [Floodgate](https://floodgate.io), a feature rollout service which provides a centralised management console for managing remote feature flags.

## Compatibility

The Node.js SDK is designed to work with Node 10+

## Installing

Navigate to your project folder

```console
npm install floodgate-node-sdk
```

## Usage

Below is a simple example of how you can use the Node.js SDK to check on the status of a flag.

```javascript
var floodgate = require("floodgate-node-sdk");

const client = floodgate.createClient("[YOUR ENVIRONMENT SDK KEY]");

client.on('ready', function() {
  const value = client.GetValue('my-feature-flag', 'default-value');
  
  if (value == 'true') {
    // Do something new and awesome
  }
  else {
    // Do whatever I usually do
  }
});
```

## Submitting issues

Sometimes everyone has issues! The Floodgate teams tracks all issues submitted to this [issue tracker](https://github.com/floodgate-io/node-sdk/issues). You are encouraged to use the issue tracker to report any bugs or submit your general feedback and feature enhancements. We will do our best to respond as quickly as possible.

## Contributing

We are always looking for talented engineers to join the Floodgate team. If you would like to contribue to our projects feel free to fork this project and when ready issue a PR back for review.

## About Floodgate

Floodgate is a remote feature management system designed to help engineering teams and product teams work independently. Using feature flags managed by Floodgate you will dramatically reduce the risks software companies face when releasing and deploying new features.

With Floodgate you can use fine grained user targeting to test out new features in your production environment with minimal impact and risk to your existing systems and customers. Floodgate provides a simple to use percentage rollout facility to allow you to perform canary releases with just a few clicks.

To learn more about Floodgate, visit us at https://floodgate.io or contact hello@floodgate.io. To get started with feature flags for free at https://app.floodgate.io/signup.

Floodgate has currently developed following SDKs.

* .Net Framework [GitHub](https://github.com/floodgate-io/dotnet-framework-sdk)
* JavaScript [GitHub](https://github.com/floodgate-io/javascript-sdk)
* Node [GitHub](https://github.com/floodgate-io/node-sdk)
* PHP [GitHub](https://github.com/floodgate-io/php-sdk)

## Contributing a New SDK

If you would like to contribute to Floodgate's library of SDKs and create an SDK for a new language, feel free to drop us an email at hello@floodgate.io