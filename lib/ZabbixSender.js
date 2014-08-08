module.exports = ZabbixSender;
var execFile = require('child_process').execFile;


function log() {
	if (console && console.log) {
		console.log(Date.now());
		console.log.apply(this, arguments);
	}
}


/**
 * creates an sender instance
 * @param {type} options
 * @returns {ZabbixSender}
 */
function ZabbixSender(options) {

	options = options || {};

	this.options = {
		config : options.config || '/etc/zabbix/zabbix_agentd.conf',
		bin : options.bin || '/usr/bin/zabbix_sender',
		hostname : options.hostname || '-', //'-' will take the one of the config
		port : options.port,
		server : options.server,
		joinString : options.joinString || '.',
		log : options.log || false,
		debug : options.debug || false
	};

	return this;
}


/**
 * send data to the zabbix
 * @param {type} data
 * @param {type} errorCallback
 * @returns {undefined}
 */
ZabbixSender.prototype.send = function(data, errorCallback) {

	var cmdArgs = getCmdArgs(this.options);
	var stdIn = stringifyData(this.options.hostname, data, this.options.joinString);

	if (this.options.log) {
		log(
				'executing: "' + this.options.bin + '"\n',
				'with arguments: "' + cmdArgs.join(' ') + '"\n',
				'and data on stdIn:\n',
				'-----------------------\n',
				stdIn,
				'-----------------------\n'
				);
	}

	if (!this.options.debug) {
		execFile(this.options.bin, cmdArgs, errorCallback).stdin.end(stdIn);
	}
	return this;
};


/**
 * Return an array of command line arguments to use for the current options given when
 * @param {object} options
 */
function getCmdArgs(options) {

	var argString = [];

	//we need to set a specific config file to use
	if (options.config) {
		argString.push('--config', options.config);
	}

	//we need to set a specific server port to use
	if (options.server) {
		argString.push('--zabbix-server', options.server);
	}

	//we need to set a specific server port to use
	if (options.port) {
		argString.push('--port', options.port);
	}

	//we want to read from std input
	argString.push('--input-file', '-');

	return argString;
}


/**
 * prepares the data structure for a zabbix sender
 * @param {object} obj
 * @param {string} hostname
 * @param {string} joinString
 * @returns {String}
 */
function stringifyData(hostname, obj, joinString) {

	var input = '';
	var flat = flattenData(obj, joinString);

	for (var key in flat) {
		var value = flat[key];
		input += [hostname, key, value].join(' ') + '\n';
	}
	return input;
}


/**
 * plain structure for objects
 * @param {type} obj
 * @param {string} joinString
 * @param {type} flat
 * @param {type} prefix
 * @returns {object}
 */
function flattenData(obj, joinString, flat, prefix) {

	flat = flat || {};
	prefix = prefix || '';

	for (var key in obj) {
		var value = obj[key];

		if (typeof value === 'object') {
			flattenData(value, joinString, flat, prefix + key + joinString);
		} else {
			if (typeof value === 'number') {
				value = value.toFixed(0);
			}

			flat[prefix + key] = value;
		}
	}

	return flat;
}