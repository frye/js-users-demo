#!/bin/bash

# CI script to run NPM tests and capture the exit code if any tests fail

# Wrapper function to run a command and capture the exit code
function ci-run {
  echo "::Running: $@"
  $@
  local status=$?
  if [ $status -ne 0 ]; then
    echo "::Error: $@"
    exit $status
  fi
  return $status
}

cd "$(dirname "$0")/.."

# run integration test if integration argument is passed
if [ "$1" == "integration" ]; then
  ci-run curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
  ci-run curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/openapi.json
  ci-run curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/redoc
  ci-run curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/users
else
  npx eslint --ignore-path .eslintignore .
  ci-run npx cspell *.js *.md
  ci-run npx markdownlint-cli -c markdownlint.yml *.md
fi
