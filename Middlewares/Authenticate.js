require('dotenv').config()
const jwt = require("jsonwebtoken")

function authentication(req, res, next){
    const token = req.headers["token"]
    if(!token){
        res.json({status: 401})
        return
    }
    try{
        const decoded = jwt.verify(token, process.env.KEY);
        if(decoded.email !== req.headers["email"]){
            res.json({status: 401})
            return
        }
    }
    catch(error){
        res.json({status: 401})
        return
    }
    next()
}

module.exports = { authentication }