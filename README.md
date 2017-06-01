This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users via the HTTP Bearer
scheme. This app extends the original demo implementing HTTPS (cuz who wants to share auth tokens and whatever comes back?) and a MySQL backend (because you don't need help for Mongo). Use this example as a starting point for your own web API.

That said there is an unmanaged (by NPM) dependency of the actual [MySQL](https://www.mysql.com/products/community/)/[MariaDB](https://mariadb.org/download/) database server. You will need it to import the users tables and the demo user/token data from the file: `./add-user-tables.sql` in order to create more users and remove the demo user (see below). 

The simple way to get started is by changing the email of user 1 to a valid email for you, then reset your password, then generate a new one.

Password reset endpoints: Generate new password and email to user
* PUT /pub/password (required: email as post body param) 
  * public, so anyone can reset anyone's password (but it's generated & emailed once then hashed & stored). 
* PUT /api/password-reset (required: token as Auth header). 
  * Works only for the current user authenticated via token.

Token generation endpoints: Upsert then return new token & set expiry to 7 days from now
* PUT /api/user/token (required: token as Auth header)
* PUT /user/token (required: email, password as post body params)

Thanks so much to these projects among many others (check [package.json](package.json) for more)
* Forked: [Express 4.x http bearer example](https://github.com/passport/express-4.x-http-bearer-example)
* Sourced: [RESTful api using nodejs](https://github.com/codeforgeek/RESTful-api-using-nodejs/)
* Required: [XKCD Password Generator](https://www.npmjs.com/package/xkcd-pass-plus)

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
curl -v -H "Authorization: Bearer 295ba2925a7015ff5726ca57e5560c0bac85c77081ce8ff954b14122014cb533fb9dde7fbaf1b77b2f675a8fe287bf719ad57b5d22905b6afd76986410bd31da1cc876" https://127.0.0.1:3443/docs
```
I would recommend using [Postman](https://www.getpostman.com/) for testing/building your API app. It will allow you to save your history, bookmarks, headers, params, auth keys, ect and share test data across devices.