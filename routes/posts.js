const express = require('express')
router = express.Router()
const { posts, likes } = require('../models')

const { validateToken } = require('../middlewares/authMiddleware')


router.get('/', validateToken, async (req, res) => {
    const listOfPosts = await posts.findAll({ include: [likes] }) //joining tables posts and likes

    const likedPosts = await likes.findAll({ where: { userId: req.user.id } })

    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts })
})

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id
    const post = await posts.findByPk(id)
    res.json(post)
})

router.get('/oneUserId/:id', async (req, res) => {
    const id = req.params.id
    const listOfPosts = await posts.findAll({
        where: {userId: id},
        include: [likes]
    })
    res.json(listOfPosts)
})

router.post('/', validateToken, async (req, res) => {
    const post = req.body
    post.username = req.user.username
    post.userId = req.user.id

    await posts.create(post)
    res.json(post)
})

router.delete('/:postId', async (req, res) => {
    const postId = req.params.postId
    await posts.destroy({
        where: {
            id: postId
        }
    })
    res.json({ message: 'Post deleted' })
})

router.put('/updateTitle', validateToken, async (req, res) => {
    const {id, title, postText} = req.body
    
    const status = await posts.update({title:title}, {
        where: {
            id: id
        }
    })
    res.json({ message: status })
})

router.put('/updateBody', validateToken, async (req, res) => {
    const {id, title, postText} = req.body
    
    const status = await posts.update({postText: postText}, {
        where: {
            id: id
        }
    })
    res.json({ message: status })
})

module.exports = router

