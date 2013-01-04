var test           = require('utest');
var assert         = require('assert');
var ZabbixReporter = require('../../lib/ZabbixSender');

test('ZabbixReporter#flatten', {
  'flattens a complex json object for zabbix': function() {
    var reporter = new ZabbixReporter();
    var flat =reporter.flatten({
      a: {
        b: {
          'c.d': 'value'
        }
      }
    });

    assert.deepEqual(flat, {'a_b_c_d': 'value'});
  },
});

test('ZabbixReporter#objectToInput', {
  'converts an object into zabbix input format': function() {
    var reporter = new ZabbixReporter({hostname: 'testhost'});
    var input = reporter.objectToInput({
      'a': 1,
      'b': 2,
      'c': {
        'd': 3,
      }
    });

    var expected =
      'testhost a 1\n' +
      'testhost b 2\n' +
      'testhost c_d 3\n';

    assert.deepEqual(input, expected);
  },
});

test('ZabbixReporter#config', {
  'Are the options stored correctly': function() {
    var reporter = new ZabbixReporter({hostname: 'testhost'});
    assert.equal(reporter.config, null);
    
    reporter = new ZabbixReporter({config: '/some/file'});
    assert.equal(reporter.config, "/some/file");

    reporter = new ZabbixReporter({port: 666});
    assert.equal(reporter.port, 666);
    
  },
});

test('ZabbixReporter#cmdLineArgs', {
  'Are the correct command line arguments used': function() {
    var reporter = new ZabbixReporter();
    var expected = [
      "--input-file",
      "-"
    ];
    assert.deepEqual(reporter.getCmdArgs(), expected);

    reporter = new ZabbixReporter({hostname: 'testhost'});
    expected = [
      "--input-file",
      "-"
    ];
    assert.deepEqual(reporter.getCmdArgs(), expected);
    
    reporter = new ZabbixReporter({config: '/some/file'});
    expected = [
      "--config",
      "/some/file",
      "--input-file",
      "-"
    ];
    assert.deepEqual(reporter.getCmdArgs(), expected);

    reporter = new ZabbixReporter({port: 666});
    expected = [
      "--port",
      666,
      "--input-file",
      "-"
    ];
    assert.deepEqual(reporter.getCmdArgs(), expected);
    
  },
});
