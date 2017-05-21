This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users via the HTTP Bearer
scheme.  Use this example as a starting point for your own web applications.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone git@github.com:jeremybradbury/express-4.x-http-bearer-example.git
$ cd express-4.x-http-bearer-example
$ npm install
```

Start the server.

```bash
$ node server.js
```

Use `curl` to send an authenticated request.

```bash
$ curl -v -H "Authorization: Bearer 123456789" https://127.0.0.1:3443/
```
