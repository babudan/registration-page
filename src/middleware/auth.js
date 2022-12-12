const jwt = require("jsonwebtoken")
const usermodle = require("../modle/usermodle");


const Authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, message: "Token required" })

        jwt.verify(token, process.env.SECRET_KEY , (error, decodeToken) => {
            if (error) {
                return res.status(401).send({ status: false, message: "token is invalid" });

            }
           req.user = decodeToken    //this line for we can access this token outside the middleware

            next()
        });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const Authorization = async (req, res, next) => {
    try {
       
        //----------------------token verification-----------------------
        const token = req.headers["x-api-key"];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken)
            return res.status(403).send({ status: false, msg: "Provide your own token" });
         let newtoken = decodedToken["_id"];
        //-------------------------finding blog-------------------------
        const teacher = await usermodle.findById(newtoken)
          
        if(!teacher) return res.status(404).send({ status: false, msg: "teacher is not exist" });
              
        //---------------------checking Authorization-------------------

        if (teacher._id != decodedToken._id || decodedToken.password != teacher.password)
            return res.status(403).send({ status: false, msg: "Unauthorized person or password is changed" });

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = {Authentication,Authorization}