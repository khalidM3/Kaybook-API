<h1 align="center"> Kaybook-API </h1>

KayBook is a RESTful API with 77 routes that can be used for e-commerce, posts, forums, polls, chat groups, dms and much more.

### Environment
Make sure you are running Node.js and have connection to a Mongo Database

### Installing
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

### Routes

All the routes are found in [`./src/router`](https://github.com/khalidM3/Kaybook-API/tree/master/src/router). I couldn't write docs for all 77 of them, so i made the code is extreamly readable. [Check it out](https://github.com/khalidM3/Kaybook-API/tree/master/src/router)

### Future of project
This project is not being maintained by me, but PR are always welcome. 
