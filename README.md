# ![Darkshield](https://avatars3.githubusercontent.com/u/4420921?v=3&s=200 "What????") Customer Dashboard
## Running the container

```bash
docker run -d -p 80:1337 -e NODE_ENV=production -e NEW_RELIC_LICENSE_KEY=9c83fc1e01356f9fc7299fcf5af082a32a76ced4 Dashboard
```

##Strider Scripts
### Environment
`NODE_ENV=test` connects to aws testing db

`NODE_ENV=development` connects to localhost

`NODE_ENV=production` i think you know
### Prepare

```bash
npm install
node node_modules/bower/bin/bower install --allow-root
```

### Test

```bash
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

```bash
sudo docker tag Dashboard darkdocker.darkshield.io:5000/dashboard
sudo docker push darkdocker.darkshield.io:5000/dashboard
```
