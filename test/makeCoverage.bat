@echo off
SET FUNCTION_FLOW_COV=1
jscoverage --no-highlight model model-cov
mocha -R html-cov %1 >coverage.html