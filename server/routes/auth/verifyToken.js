const jwt = require("jsonwebtoken")


module.exports = function (req, res, next) {
    const token = req.header("auth-token")
    if (!token) {
        return res.status(401).end({message : "Acess Denied!"})
    }

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = verified;

        next()
    } catch (err) {
        res.status(400).end({message : "Invalid token -> Acess denied"})
    }


}
