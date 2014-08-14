from  ubuntu:12.04

run   echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
run   apt-get -y update

run   apt-get -y install wget git

run   apt-get -y install build-essential python
run   apt-get -y install libexpat1-dev libexpat1 libicu-dev

run   wget -O - http://nodejs.org/dist/v0.10.30/node-v0.10.30-linux-x64.tar.gz | tar -C /usr/local/ --strip-components=1 -zxv

ADD   ./app /src/build/app
ADD   ./bower_components /src/build/bower_components
ADD   ./lib /src/build/lib
ADD   ./packages.json /src/build/packages.json

run   cd /src/build; npm install --production

CMD npm start /src/build && /src/build/node_modules/pm2/bin/pm2 logs