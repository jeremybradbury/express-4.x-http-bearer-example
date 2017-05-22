This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users via the HTTP Bearer
scheme. This app extends the original demo implementing HTTPS (cuz who wants to share auth tokens and whatever comes back?) and a MySQL backend (because you don't need help for Mongo). Use this example as a starting point for your own web API.

That said there is an unmanaged (by NPM) dependency of the actual MariaDB/MySQL database server. You will need it to import the users table the demo user/token data.

For https without MySQL (still using a flat user/token file from the demo) see [tag v0.1](/jeremybradbury/express4-https-bearer-token-mysql-api//tree/v0.1).

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
git clone git@github.com:jeremybradbury/express4-https-bearer-token-mysql-api.git
cd express4-https-bearer-token-mysql-api
npm install
```

Import demo table user/token.
```bash
sudo mysql -p restful_api_demo < add-user-tables.sql
```

Start the server.

```bash
npm start
```

Use `curl` to send an authenticated request to list available endpoints:

```bash
curl -v -H "Authorization: Bearer 123456789" https://127.0.0.1:3443/api
```
