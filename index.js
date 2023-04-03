//initialise express server, make api request through routes and more - npm install express cors mysql2
//npm install nodemon -- to automatically restart server everytime new code is saved

const express = require('express')
const app = express()

//cors library required for Access control policy
const cors = require('cors')

//To ensure express parses the post request as json
app.use(express.json())
app.use(cors())  //fix cors origin issue

//require dotenv to configure ENV variables
require("dotenv").config()

//import data model
const db = require('./models')

//Routers - created once models have already been built and route file has been created - after model is built you will see table is created in DB
const usersRouter = require('./routes/users')
app.use('/auth', usersRouter)

const postsRouter = require('./routes/posts')
app.use('/posts', postsRouter)

const commentsRouter = require('./routes/comments')
app.use('/comments', commentsRouter)

const likesRouter = require('./routes/likes')
app.use('/likes', likesRouter)

//connect with mysql database
//start MySQL service. Start workbench. Create schema and apply.
//npm install sequelize sequelize-cli to write scripts in the app itself. 
//After sequelize new folders like models/migrations/scripts gets created.

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3002, () => {
        console.log("App running on port 3002")
    });
}).catch(err => {
    console.log(err)
})





