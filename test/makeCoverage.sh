#!/bin/bash
declare -x FUNCTION_FLOW_COV=1
./jscoverage --no-highlight model model-cov
mocha -R html-cov --timeout 7000 $1 >coverage.html
