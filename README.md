# ![Darkshield](https://avatars3.githubusercontent.com/u/4420921?v=3&s=200 "What????") Customer Dashboard
## Running the container

```bash
sudo docker run -p 8888:1337 -e NODE_ENV=production -e NEW_RELIC_LICENSE_KEY=9c83fc1e01356f9fc7299fcf5af082a32a76ced4 darkdocker.darkshield.io:5000/dashboard
```

##Development
```bash
npm test
```
To see all the grunt test configurations in Webstorm:
`ctrl + click` on `Gruntfile.js`  and select "Open Grunt Console". There you can see all the test options. Grunt now automatically sets the proper environment variable based on the test you select. So no more `export NODE_ENV`

I suggest running `autotest:backend` with the webstorm grunt tool while also running the webstorm karmatool using `config/karma.unit.conf.js` as your config file. This will allow you to just code and save and get feedback via webstorms notifications, well for grunt you just get "process finished with exit code zero" in the bottom left, but karma gives a nice little popup to remind you look.


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
