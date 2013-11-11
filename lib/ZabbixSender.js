module.exports = ZabbixSender;
var exec = require('child_process').execFile;


/**
 * creates an sender instance
 * @param {type} options
 * @returns {ZabbixSender}
 */
function ZabbixSender(options) {
	
	options = options || {};
	
	this.options = {
		config : options.config,
		bin:options.bin || 'zabbix_sender',
		hostname : options.hostname || '-', //'-' will take the one of the config
		port : options.port
	};
	
	return this;
}


/**
 * send data to the zabbix
 * @param {type} data
 * @param {type} callbackAfterSend
 * @returns {undefined}
 */
ZabbixSender.prototype.send = function(data, callbackAfterSend) {
	exec(this.bin, this.getCmdArgs(), callbackAfterSend).stdin.end(stringifyData(data, this.hostname));
	return this;
};


/**
 * Return an array of command line arguments to use for the current options given when 
 * this instance was constructed.
 */
ZabbixSender.prototype.getCmdArgs = function() {
	
	var args = [];
	
	//we need to set a specific config file to use
	if (this.config) {
		args.push('--config', this.config);
	}
	
	//we need to set a specific server port to use
	if (this.port) {
		args.push('--port', this.port);
	}
	
	//we want to read from st input
	args.push('--input-file', '-');  
	return args;
};


/**
 * prepares the data structure for a zabbix sender
 * @param {object} obj
 * @param {string} hostname
 * @returns {String}
 */
function stringifyData(obj, hostname) {
	
	var input = '';
	var flat = flattenData(obj);

	for (var key in flat) {
		var value = flat[key];
		input += [hostname, key, value].join(' ') + '\n';
	}

	return input;
};


/**
 * plain structure for objects
 * @param {type} obj
 * @param {type} flat
 * @param {type} prefix
 * @returns {object}
 */
function flattenData(obj, flat, prefix) {
	
	flat = flat || {};
	prefix = prefix || '';

	for (var key in obj) {
		var value = obj[key];

		if (typeof value === 'object') {
			flattenData(value, flat, prefix + key + '.');
		} else {
			if (typeof value === 'number')
				value = value.toFixed(0);

			flat[prefix + key] = value;
		}
	}

	return flat;
};

