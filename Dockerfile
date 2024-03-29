from  ubuntu:12.04

run   echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
run   apt-get -y update

run   apt-get -y install wget git

run   apt-get -y install build-essential python
run   apt-get -y install libexpat1-dev libexpat1 libicu-dev

run   wget -O - http://nodejs.org/dist/v0.10.31/node-v0.10.31-linux-x64.tar.gz | tar -C /usr/local/ --strip-components=1 -zxv

ADD   ./app /src/build/app
ADD   ./package.json /src/build/package.json
ADD   ./newrelic.js /src/build/newrelic.js
ADD   ./bower.json /src/build/bower.json

run   cd /src/build && npm install --production
run   cd /src/build && npm install bcrypt
run   cd /src/build && npm install newrelic
run   cd /src/build && node_modules/bower/bin/bower install --allow-root

CMD   cd /src/build && npm start
