const express = require("express");
const { usercreate ,userlogin ,forget_password ,reset_password} = require("../controller/usercontroller");
const router = express.Router();


router.post( "/user/register" , usercreate);

router.get("/user/login" ,userlogin);

router.post("/api/forget-password" ,forget_password);

router.get("/api/reset-password" ,reset_password);

module.exports = router;
