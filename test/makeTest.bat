@echo off
SET ZABBIX_SENDER_COV=
mocha -R spec --check-leaks %1