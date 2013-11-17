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

* **config**: The configuration file to use. Default: (zabbix default)
* **bin**: The path to the zabbix_sender program. Default: `'zabbix_sender'`
* **hostname**: The hostname to report to zebbix. Default: (zabbix default)
* **port**: The zabbix server port to use. Default: (zabbix default)
* **joinString**: String for concatenating nested object properties. Default: '.'

## NPM Maintainers

The npm module for this library is maintained by:

* [Felix Geisendörfer](http://github.com/felixge)
* [Dan Jenkins](http://github.com/danjenkins)

## License

zappix-sender is licensed under the MIT license.
