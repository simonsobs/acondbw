[![Build Status](https://travis-ci.com/simonsobs/acondbw.svg?branch=master)](https://travis-ci.com/simonsobs/acondbw) [![Coverage Status](https://coveralls.io/repos/github/simonsobs/acondbw/badge.svg?branch=master)](https://coveralls.io/github/simonsobs/acondbw?branch=master)

# acondbw

Product DB website

## How to check out and run (for developers)

### Run the GraphQL server

Run the GraphQL server [Acondbs](https://github.com/simonsobs/acondbs). The instructions are written in [README.md](https://github.com/simonsobs/acondbs/blob/master/README.md).

### Install npm

Install [*npm*](https://www.npmjs.com/) (node package manaer) if not installed. The npm is disributed with [*Node.js*](https://nodejs.org/)

#### on MacOS

This section breifely describes how to install npm on Mac with [Nodebrew](https://github.com/hokaccha/nodebrew) in [Homebrew](https://brew.sh/).

##### Uninstall node.js if installed

```bash
brew uninstall --force node
```

##### Install nodebrew

```bash
brew install nodebrew
```

Add `$HOME/.nodebrew/current/bin` to `PATH`. For example, add the following line in `.bash_profile`.

```bash
export PATH=$HOME/.nodebrew/current/bin:$PATH
```

##### Install node.js

```bash
mkdir -p ~/.nodebrew/src
nodebrew install-binary latest
```

##### Select node version

Acondbw is being developed in v13.5.0. It probably works in other versions. However, to use the same version,

```bash
nodebrew use v13.5.0
```

##### Confirm npm is available

The npm should have been installed.

```bash
type -a npm
```

### Check out

Check out Acondbw from GitHub and install required pacakages.

```bash
git clone git@github.com:simonsobs/acondbw.git
cd acondbw
npm install
```

### Run

Run with the node server for the development

```bash
npm run serve
```

The website is running locally at the default TCP port, probably 8080. By default, the site can be accessed only from localhost.

<http://localhost:8080>

You can allow access from outside or speify the TCP port, for example, as follows

```bash
npx vue-cli-service serve --host 0.0.0.0 --port 8080
```

By default, the GraphQL server Acondbs is assumed to be running at <http://localhost:5000/graphql>. If the server address is different, you can change it in `.env` file.

### Unit test

Run the unit tests

```bash
npm run test:unit
```

To update snapshots of tests

```bash
npm run test:unit -- -u
```
