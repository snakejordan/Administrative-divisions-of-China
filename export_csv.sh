#!/usr/bin/env bash

source ./lib/config.ini
sqlite3 -header -csv ${dataPath}data.sqlite 'SELECT * FROM province ORDER BY code;' > ${dataPath}provinces.csv
sqlite3 -header -csv ${dataPath}data.sqlite 'SELECT * FROM city ORDER BY code;' > ${dataPath}cities.csv
sqlite3 -header -csv ${dataPath}data.sqlite 'SELECT * FROM area ORDER BY code;' > ${dataPath}areas.csv
sqlite3 -header -csv ${dataPath}data.sqlite 'SELECT * FROM street ORDER BY code;' > ${dataPath}streets.csv
sqlite3 -header -csv ${dataPath}data.sqlite 'SELECT * FROM village ORDER BY code;' > ${dataPath}villages.csv
