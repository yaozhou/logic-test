#!/bin/sh

PWD=$(cd `dirname $0`; pwd)
echo $PWD
PID=`cat pid`
kill $PID
git add res/we.db
git commit -m "backup db"
git pull
git push
node main.js &
echo $! > pid
