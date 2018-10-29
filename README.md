This micro-services is created for Integration base information keeping.

## CONTENTS
- [1. AUTHOR](#1-author)
- [2. REQUIREMENTS](#2-requirements)
- [3. INSTALLATION](#3-installation)
- [4. PRE-BUILD STEPS](#4-pre-build-steps)
- [5. RUN](#5-run)
- [6. BUILD STEPS](#6-build-steps)
- [7. DEPLOY STEPS](#7-deploy-steps)

## 1. AUTHOR

IOX GmbH 
E-mail: office@.ioxlab.de
Tel: +49-211-545548 90
www.ioxlab.de

*Project Contact Person*

Robert Jänisch

## 2. REQUIREMENTS

- npm: v5.x.x
- Node: v8.x.x
- angular-cli: 1.x.x (optional)
- PostgresQL: 9.6 

## 3. INSTALLATION

***Mac OS X***

* Node

```sh
# Install 'Homebrew' first
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# Install 'node' via 'Homebrew'
$ brew install node
# Update the node version
$ npm install npm@5.5.1
```

***Debian Linux***

* Node

```sh
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ npm install npm@5.5.1
```

***Amazon EC2***

* Node

```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
$ . ~/.nvm/nvm.sh
$ nvm install 6.9.5
```

***Other requiroments***

```sh
$ npm install -g angular-cli
$ npm install -g typescript
$ npm install -g typings
```

## 4. PRE-BUILD STEPS

```sh
$ cd $PROJECT_DIR
$ npm install
```

## 5. RUN

* Runs the server on development mode

```sh
$ cd $PROJECT_DIR
# URL is http://localhost:4600
$ npm run start:server
```

## 6. BUILD STEPS

**To build the project run the following command**
```sh
$ cd $PROJECT_DIR
$ npm run deploy:build 
```
As a result
* The server will be build in production mode for deployment an located on 'dist/server' folder.


## 7. DEPLOY STEPS

* Prepare deployment package

```sh
$ cd $PROJECT_DIR
$ npm run deploy:build 
```

* Deploy package

** Move the deployment package to production server
** Connect to deploymet server

*  Note updated
** Please run the following commands if you setup the environment first time.
```sh
# For redirecting requests to http/https default port to the server running port run the following command with corresponding ports
# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport ${http/https default port} -j REDIRECT --to-port ${port}
$ sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 4600
$ service iptables save # For saving iptables configuration after machine reboot. Should be used one time.
```
*  Note updated End

* Run the following commands in terminal:
```sh
$ cd $DEPLYMENT/PACKAEGE/PATH
$ npm install
$ pm2 kill # Optional action to kill Application proccess. Please be cearful not to kill all processes
$ npm start
# Please run this command if you setup the environment first time.
$ pm2 startup # To make application run on startup.
```

