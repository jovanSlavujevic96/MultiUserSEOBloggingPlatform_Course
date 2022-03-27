# Server setup

Install node.js for Win

Initialize the server
> $ cd backend
>
> $ npm init -y

Install the following packages:

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
> cd C:\
>
> md "\data\db"
>
> `mongod --dbpath="C:\data\db"`
