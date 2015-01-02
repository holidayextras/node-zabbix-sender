# zabbix-sender

A zabbix_sender wrapper.

## Install

```
npm install zabbix-sender
```

## Usage

```js
var ZabbixSender = require('zabbix-sender');
var sender       = new ZabbixSender();

sender.send({
  'valueA': 1,
  'nested': {
    'valueB': 2,
  }
}, function(err) {
  if (err) throw err;

  console.log('Wrote keys to zabbix');
});
```

## Nested properties

Nested properties are represented as flat strings. The join Character can be defined via the "joinString" option.

## Configuration options

The ZabbixSender constructor takes an object which has the following defaults:

* **config**: The configuration file to use. Default: `/etc/zabbix/zabbix_agentd.conf`
* **bin**: The path to the zabbix_sender program. Default: `/usr/bin/zabbix_sender`
* **hostname**: The hostname to report to zebbix. Default: `-` (zabbix default)
* **server**: The zabbix server (IP or hostname) to use. Default: (zabbix default)
* **port**: The zabbix server port to use. Default: (zabbix default)
* **debug**: If set to true, the binary will not be called. Default : `false`
* **log**: Output a message on the console, when data is send to the server. Default : `false`
* **joinString**: String for concatenating nested object properties. Default: `.`

## NPM Maintainers

The npm module for this library is maintained by:

* [Felix Geisendörfer](http://github.com/felixge)
* [Dan Jenkins](http://github.com/danjenkins)

## License

zappix-sender is licensed under the MIT license.
