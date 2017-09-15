#!/bin/bash
#
#  This script is the ENTRYPOINT for the docker container; it starts a Redis daemon and
#  fires up node.
#

# Add the plotting and extractor paths to python
export PYTHONPATH="$PYTHONPATH:/opt/geona/plotting:/opt/geona/plotting/data_extractor"

# build the app from the source files
cd /opt/geona
grunt

#start redis
/usr/bin/redis-server --daemonize yes; 

# start the app
/usr/bin/node /opt/geona/app.js > /opt/geona/config/app.log
