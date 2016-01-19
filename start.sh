#!/bin/bash
cd `dirname $0`
screen -S webcdn.corp.jide.com -d -m node app.js
