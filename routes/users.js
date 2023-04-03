const express = require('express')
router = express.Router()
const { users } = require('../models')
const bcrypt = require('bcryptjs')

//This is to generate session token
const { sign } = require('jsonwebtoken')

const { validateToken } = require('../middlewares/authMiddleware')


// router.get('/', async (req, res) =>{
//     const listOfPosts = await posts.findAll()
//     res.json(listOfPosts)
// })

// router.get('/byId/:id', async (req, res) => {
//     const id = req.params.id
//     const post = await posts.findByPk(id)
//     res.json(post)
// })

router.post('/', async (req, res) => {
    const { username, password } = req.body
    bcrypt.hash(password, 10).then((hash) => {
        users.create({
            username: username,
            password: hash
        })
        res.json(res.status)
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await users.findOne({
        where: {
            username: username
        }
    })

    //if user exist in the DB then only match password otherwise 
    //return error
    if (user) {
        bcrypt.compare(password, user.password).then(async (result) => {
            if (result) {
                //we create a session token which we will store in frontend in session storgae 
                //and validate user everytime they make any request
                const accessToken = sign({ username: user.username, id: user.id }, "importantsecret")
                res.json({ token: accessToken, username: username, id: user.id })

            } else {
                res.status(401).json({ error: 'Invalid username or password' })
            }
        })

    } else {
        res.status(401).json({ error: 'User does not exist, register to start posting' })
    }

})

//validate every request
router.get('/validate', validateToken, (req, res) => {
    res.json(req.user)
})

//user profile details
router.get("/profileInfo/:id", async (req, res) => {
    const id = req.params.id
    //const { username } = req.body

    const profileInfo = await users.findByPk(id, {
        attributes: {
            exclude: ["password"]
        },
    })

    res.json(profileInfo)
});

//update password
router.put("/updatePassword", validateToken, async (req, res) => {
    const username = req.user.username
    const {oldPassword, newPassword} = req.body
    const user = await users.findOne({
        where: {
            username: username
        }
    })

    if (user) {
        bcrypt.compare(oldPassword, user.password).then(async (result) => {
            if (!result) {
                res.status(401).json({ error: 'Wrong old password entered' })
            } else {
                bcrypt.hash(newPassword, 10).then((hash) => {
                    users.update({password: hash},
                        {where: {username: username}}
                    )
                    res.json("Password updated")
                })
            }
        })

    } else {
        res.status(401).json({ error: 'User does not exist, register to start' })
    }

})


module.exports = router

