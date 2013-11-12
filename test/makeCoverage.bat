@echo off
SET ZABBIX_SENDER_COV=1
jscoverage --no-highlight ../lib ../lib-cov
mocha -R html-cov %1 >coverage.html