<h1 align="center"> Kaybook-API </h1>

KayBook is a RESTful API which can be used for e-commerce, posts, forums, polls, chat groups, dms and much more.

### Environment
Make sure you are running Node.js and have connection to a Mongo Database

### installing
1. Clone the repo by running `git clone https://github.com/khalidM3/Kaybook-API`
2. Install dependacies by running `npm install` or `yarn install`
3. Add a .env file with the following content, make sure to switch the placeholders with your values. 
```
    PORT= <PORT>
    SECRET= <SECRET>
    MONGODB_URI= <MONGODB_UR>
    CORS_ORIGINS='localhost:8080'
    AWS_BUCKET= <AWS BUCKET>
    AWS_ACCESS_KEY_ID= <AWS_ACCESS_KEY_ID>
    AWS_SECRET_ACCESS_KEY= <AWS_SECRET_ACCESS_KEY>
```
4. Run `npm start` to start server
