#!/bin/bash

export NODE_ENV=test
export APP_PORT=4001

target="test/"

if [ $# -eq 1 ]
  then
    target="$target"$1
fi

sequelize db:migrate
mocha --exit --recursive $target