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
