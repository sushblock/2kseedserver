const express = require('express')
router = express.Router()
const { comments } = require('../models')

const { validateToken } = require('../middlewares/authMiddleware')

router.get('/:postId', async (req, res) => {
    const postId = req.params.postId
    const comment = await comments.findAll({
        where: {
            postId: postId,
        }
    })
    res.json(comment)
})

router.post('/', validateToken, async (req, res) => {
    const comment = req.body
    const username = req.user.username
    comment.username = username
    await comments.create(comment)
    res.json(comment)
})

router.delete('/:commentId', validateToken, async (req, res) => {
    const commentId = req.params.commentId
    await comments.destroy({
        where: {
            id: commentId
        }
    })
    res.json({ message: 'Comment deleted' })
})

module.exports = router

