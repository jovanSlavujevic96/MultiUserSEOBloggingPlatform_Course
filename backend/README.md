# Server setup

To get default (environment) parameters extract .env zip file with public secret password ;)

Install node.js for Win

Initialize the backend project
> $ cd backend
>
> $ npm init -y

Install the following npm packages:

- express
- mongoose (to talk with MongoDB)
- body-parser
- cookie-parser
- morgan (to see endpoints on terminal)
- nodemon (to run server)
- dotenv (to access environment variables - from .env file)
- cors (to make our API accessible to the front client / to avoid CORS errors)

> $ npm install express mongoose body-parser cookie-parser morgan nodemon dotenv cors

# MongoDB setup

Install MongoDB & Robo3T

## Mongo DB install notes
- Uncheck `Install MongoD as a Service`
- Uncheck `Install MongoDB Compass`, because we're using Robo3T

Update PATH environment variable to include mongod bin dir

Run command prompt as Administrator
> $ cd C:\
>
> $ md "\data\db"
>
> $ `mongod --dbpath="C:\data\db"`

## Install packages for auth and blog

Install the following npm packages for auth and blog:
- express-validator (for validation)
- jsonwebtoken (to generate JSON web token so we can send it to our client postman/react)
- express-jwt (to check is generated token still valid or not)
- formidable (to receive form data, which is different than JSON data)
- lodash (helper methods)
- slugify (to generate slug)
- string-strip-html (to create a new blog)

> $ npm install express-validator jsonwebtoken express-jwt formidable lodash slugify string-strip-html

To generate unique usernames we're going to install shortid npm package
> $ npm install shortid

To run server:
> $ npm run start

To use a sendgrid with node.js there is a npm package:
> $ npm i @sendgrid/mail

## How to setup Google login on your app

1. Make sure you are signed in with you Google account & registered Google Developer account
2. Go to https://console.cloud.google.com page
3. Create a <b>NEW PROJECT</b>
4. Swith to <b>NEW PROJECT</b>
5. Go to <i>API & Services</i> -> <i>Credentials</i>
6. Go to <b>Configure OAuth consent screen</b>
7. For <b>User Type</b> select <i>Extenral</i> and click <b>CREATE</b> button
8. Fill <b>Application name</b> <b>User support email</b> and <b>Developer contact information</b> and clikc <b>SAVE & CONTINUE</b> button
9. For next pages keep clicking <b>SAVE & CONTINUE</b> untill you got out from <b>OAuth consent screen</b> and finnaly click <b>GO BACK TO DASHBOARD</b>
10. Go to <i>Create Credentials</i> -> <i>OAuth client ID</i>
11. For <b>Application type</b> select <i>Web application</i>, fill <b>Name</b> and add <b>Authorized JavaScript origins</b> and <b>Authorized redirect URIs</b> by clicking <b>ADD URI</b> button of CLIENT URL (i.e. http://localhost:3000) and finnaly click <b>CREATE</b> button
12. On "OAuth client created" popup copy <b>Your Client ID</b> to your config file(s) on both backend (.env) & frontend side (next.config.js)

To use Google Login mechanism install:
> $ npm i google-auth-library
