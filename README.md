This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users via the HTTP Bearer
scheme. This app extends the original demo implementing HTTPS (cuz who wants to share auth tokens and whatever comes back?) and a MySQL backend (because you don't need help for Mongo). Use this example as a starting point for your own web API.

That said there is an unmanaged (by NPM) dependency of the actual [MySQL](https://www.mysql.com/products/community/)/[MariaDB](https://mariadb.org/download/) database server. You will need it to import the users tables and the demo user/token data from the file: `./add-user-tables.sql` in order to create more users and remove the demo (see below). Token generation endpoint has still has not been implemented but would require an authorized username/password.

For https without MySQL (still using a flat user/token file from the demo) see release [v0.1](../../tree/v0.1).

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
curl -v -H "Authorization: Bearer 123456789" https://127.0.0.1:3443/docs
```
I would recommend using [Postman](https://www.getpostman.com/) for testing/building your API app. It will allow you to save your history, bookmarks, headers, params, auth keys, ect and share test data across devices.