//whoever comments to a post will be verified if that user is a valid user
//we will grab the accessToken sent through frontend and validate if a valid user
//before comment is updated, otherwise some kind of message or action to login 
//will be displayed

const {verify} = require ('jsonwebtoken')

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")
    if (!accessToken) {        
        return res.json({error: "User not logged in"})        
    }

    try{
        const validToken = verify(accessToken, "importantsecret")
        req.user = validToken //extracting the user object from accessToken 
        if(validToken){
            return next()
        }
    }catch(err){
        return res.json({error: err})
    }
}

module.exports = {validateToken}
 
