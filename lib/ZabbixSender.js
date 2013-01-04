var exec = require('child_process').execFile;
var os   = require('os');

module.exports = ZabbixSender;
function ZabbixSender(options) {
  options = options || {};

  this.config   = options.config || null;  //use no specific config file by default
  this.bin      = options.bin || 'zabbix_sender';
  this.hostname = options.hostname || os.hostname();
  this.port = options.port || null;  //use no specific port by default
}

ZabbixSender.prototype.send = function(obj, cb) {
  var input = this.objectToInput(obj);
  
  var zabbixSender = exec(this.bin, this.getCmdArgs(), cb);

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

/**
 * Return an array of command line arguments to use for the current options given when 
 * this instance was constructed.
 */
ZabbixSender.prototype.getCmdArgs = function(){
  var args = [];
  if(this.config){  //we need to set a specific config file to use
    args.push.apply(args, ['--config', this.config]);
  };
  if(this.port){  //we need to set a specific server port to use
     args.push.apply(args, ['--port', this.port]);
  };
  args.push.apply(args, ['--input-file', '-']);  //keep this last
  return args
};
