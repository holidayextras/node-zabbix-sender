path = require('path');

//loading test modules
chai = require('chai');
sinon = require('sinon');
proxyquire = require('proxyquire');

//configure chai
chai.use(require("sinon-chai"));
chai.config.includeStack = true;

PATH_TO_ROOT = path.resolve('lib-cov/');