const express = require('express')
router = express.Router()
const { likes } = require('../models')
const { validateToken } = require('../middlewares/authMiddleware')



router.post("/", validateToken, async (req, res) => {
    const { postId } = req.body //from the request body
    const userId = req.user.id //from the accessToken

    console.log("userId is", userId)
    if(userId == null)
        res.status(400).send("Unauthorized")

    const found = await likes.findOne({ where: { postId: postId, userId: userId } })
    

    if (!found) {
        await likes.create({ postId: postId, userId: userId  })
        res.json({message: true})
    }
    else {
        await likes.destroy({ where: { postId: postId, userId: userId } })
        res.json({message: false})
    }
    
});

module.exports = router