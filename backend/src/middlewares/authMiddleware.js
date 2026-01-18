const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(400).json({message: "Authorization token Required"})
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next();
    }catch(e){
        return res.status(400).json({message: "Invalid or Expired JWT Token"})
    }
}
module.exports = authMiddleware