![Darkshield](https://avatars3.githubusercontent.com/u/4420921?v=3&s=200 "What????") 
### Darkshield Customer Dashboard



## Running the container

```
docker run -p 8888:1337 -e NODE_ENV=production -e NEW_RELIC_LICENSE_KEY=9c83fc1e01356f9fc7299fcf5af082a32a76ced4 Dashboard
```

##Strider Scripts

### Prepare

```
npm install
node node_modules/bower/bin/bower install --allow-root
```

### Test

```
npm test

if [ $? != 0 ] ; then
    exit 1
else
    sudo docker build -t Dashboard .
    build=$?
    exit $build
fi
```

### Deploy

```
sudo docker tag Dashboard darkdocker.darkshield.io:5000/dashboard
sudo docker push darkdocker.darkshield.io:5000/dashboard
```
