// The Lib we want to test
var ZabbixSender = require(path.join(PATH_TO_ROOT, 'ZabbixSender.js'));
var expect = chai.expect;

var binLocation = '/usr/bin/zabbix_sender';

describe('constructer()', function() {
	it('checking default options', function() {
		var sender = new ZabbixSender();
		expect(sender.options).to.be.deep.equal({
			config : '/etc/zabbix/zabbix_agentd.conf',
			bin : binLocation,
			debug : false,
			log : false,
			hostname : '-',
			port : undefined,
			server : undefined,
			joinString : '.'
		});
	});
});

describe('ZabbixSender.send()', function() {
	var endSpy;
	var execStub;
	var ZabbixSenderFakeExec;
	var expectedDefaultEncodedOptions = ['--config', '/etc/zabbix/zabbix_agentd.conf', '--input-file', '-'];

	beforeEach(function() {
		endSpy = sinon.spy();
		execStub = sinon.stub().returns({
			stdin : {
				end : endSpy
			}
		});

		ZabbixSenderFakeExec = proxyquire(
				path.join(PATH_TO_ROOT, 'ZabbixSender.js'),
				{'child_process' : {execFile : execStub}}
		);

	});

	describe('options used correctly', function() {

		it('default', function() {

			var sender = new ZabbixSenderFakeExec();
			sender.send({});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					expectedDefaultEncodedOptions,
					undefined
					);
			expect(endSpy).to.be.called.Once;

		});

		it('config provided', function() {

			var sender = new ZabbixSenderFakeExec({config : './test/file.js'});
			sender.send({});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					['--config', './test/file.js', '--input-file', '-'],
					undefined
					);
			expect(endSpy).to.be.called.Once;
		});

		it('bin provided', function() {

			var sender = new ZabbixSenderFakeExec({bin : './test/zabbix_sender.exe'});
			sender.send({});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					'./test/zabbix_sender.exe',
					expectedDefaultEncodedOptions,
					undefined
					);
			expect(endSpy).to.be.called.Once;
		});

		it('port provided', function() {

			var sender = new ZabbixSenderFakeExec({port : 12345});
			sender.send({});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					['--config', '/etc/zabbix/zabbix_agentd.conf', '--port', 12345, '--input-file', '-'],
					undefined
					);
			expect(endSpy).to.be.called.Once;
		});

		it('hostname provided, but no data during send', function() {

			var sender = new ZabbixSenderFakeExec({hostname : 'HOSTNAME'});
			sender.send({});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					expectedDefaultEncodedOptions,
					undefined);

			expect(endSpy).to.be.called.Once;
		});

		it('hostname provided, and considered in data', function() {

			var sender = new ZabbixSenderFakeExec({hostname : 'HOSTNAME'});
			sender.send({key : 'value'});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					expectedDefaultEncodedOptions,
					undefined);

			expect(endSpy).to.be.called.Once;
			expect(endSpy).always.have.been.calledWithExactly('HOSTNAME key value\n');
		});
	});

	describe('error callback', function() {
		it('the error callback is parsed to the exec', function() {

			var sender = new ZabbixSenderFakeExec();
			var errorCallback = sinon.spy();
			sender.send({}, errorCallback);
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					expectedDefaultEncodedOptions,
					errorCallback);

			expect(errorCallback).to.be.not.called;
			expect(endSpy).to.be.called.Once;

		});
	});

	describe('data provided to send method', function() {


		it('dot in key', function() {

			var sender = new ZabbixSenderFakeExec();
			sender.send({'keyA.keyB' : 'propC'});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					expectedDefaultEncodedOptions,
					undefined);

			expect(endSpy).to.be.called.Once;
			expect(endSpy).always.have.been.calledWithExactly('- keyA.keyB propC\n');
		});

		it('property is a number with float and should be rounded', function() {
			var sender = new ZabbixSenderFakeExec();
			sender.send({NaNaNaNa : 123.4567});
			expect(execStub).to.be.called.Once;
			expect(execStub).always.have.been.calledWithExactly(
					binLocation,
					expectedDefaultEncodedOptions,
					undefined);

			expect(endSpy).to.be.called.Once;
			expect(endSpy).always.have.been.calledWithExactly('- NaNaNaNa 123\n');
		});

		describe('nested data', function() {

			runTestsWithGivenJoinString('.');
			runTestsWithGivenJoinString('_');

			function runTestsWithGivenJoinString(joinString) {

				describe('running Test with joinString: "' + joinString + '"', function() {

					var options = {joinString : joinString};

					it('single nested property, 2 levels', function() {
						var sender = new ZabbixSenderFakeExec(options);
						sender.send({keyA : {keyB : 'propC'}});
						expect(execStub).to.be.called.Once;
						expect(execStub).always.have.been.calledWithExactly(
								binLocation,
								expectedDefaultEncodedOptions,
								undefined);

						expect(endSpy).to.be.called.Once;
						expect(endSpy).always.have.been.calledWithExactly('- keyA' + joinString + 'keyB propC\n');
					});

					it('single nested property, 3 levels', function() {
						var sender = new ZabbixSenderFakeExec(options);
						sender.send({keyA : {keyB : {keyC : 'propD'}}});
						expect(execStub).to.be.called.Once;
						expect(execStub).always.have.been.calledWithExactly(
								binLocation,
								expectedDefaultEncodedOptions,
								undefined);

						expect(endSpy).to.be.called.Once;
						expect(endSpy).always.have.been.calledWithExactly('- keyA' + joinString + 'keyB' + joinString + 'keyC propD\n');
					});

					it('mixing 2nd level and 3rd level properties', function() {
						var sender = new ZabbixSenderFakeExec(options);
						sender.send({keyA : {
								keyB : {
									keyC : 'propD'
								}, keyX : 'propZ'
							}
						});
						expect(execStub).to.be.called.Once;
						expect(execStub).always.have.been.calledWithExactly(
								binLocation,
								expectedDefaultEncodedOptions,
								undefined);

						expect(endSpy).to.be.called.Once;
						expect(endSpy).always.have.been.calledWithExactly('- keyA' + joinString + 'keyB' + joinString + 'keyC propD\n- keyA' + joinString + 'keyX propZ\n');
					});
				});
			}
		});
	});
});