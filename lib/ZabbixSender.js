var exec = require('child_process').execFile;
var os = require('os');

module.exports = ZabbixSender;
function ZabbixSender(options) {
  options = options || {};

  this.config   = '/etc/zabbix/zabbix_agentd.conf';
  this.bin      = options.bin || 'zabbix_sender';
  this.hostname = options.hostname || os.hostname();
}

ZabbixSender.prototype.send = function(obj, cb) {
  var input = this.objectToInput(obj);
  var args = [
    '--input-file', '-',
    '--config', this.config,
  ];

  var zabbixSender = exec(this.bin, args, cb);

  zabbixSender.stdin.end(input);
};

ZabbixSender.prototype.objectToInput = function(obj) {
  var input = '';
  var flat  = this.flatten(obj);

  for (var key in flat) {
    var value = flat[key];
    input += [this.hostname, key, value].join(' ') + '\n';
  }

  return input;
};

ZabbixSender.prototype.flatten = function(obj, flat, prefix) {
  flat   = flat || {};
  prefix = prefix || '';

  for (var key in obj) {
    var value = obj[key];
    key = key.replace(/\./g, '_');

    if (typeof value === 'object') {
      this.flatten(value, flat, prefix + key + '_');
    } else {
      if (typeof value === 'number') value = value.toFixed(0);

      flat[prefix + key] = value;
    }
  }

  return flat;
};
