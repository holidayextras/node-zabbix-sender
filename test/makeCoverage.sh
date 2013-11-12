#!/bin/bash
declare -x ZABBIX_SENDER_COV=1
./jscoverage --no-highlight lib lib-cov
mocha -R html-cov --timeout 7000 $1 >coverage.html
