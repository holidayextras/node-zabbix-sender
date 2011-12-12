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

## Configuration options

The ZabbixSender constructor takes an object which has the following defaults:

* **config**: The configuration file to use. Default: `'/etc/zabbix/zabbix_agentd.conf'`
* **bin**: The path to the zabbix_sender program. Default: `'zabbix_sender'`
* **hostname**: The hostname to report to zebbix. Default: `os.hostname()`

## License

zappix-sender is licensed under the MIT license.
