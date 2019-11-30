#!/bin/bash

export NODE_ENV=test
export PORT=4001

target="test/"

if [ $# -eq 1 ]
  then
    target="$target"$1
fi

knex migrate:latest
mocha --exit --recursive $target