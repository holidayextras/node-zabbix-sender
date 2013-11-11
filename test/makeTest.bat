@echo off
SET FUNCTION_FLOW_COV=
mocha -R spec --check-leaks %1