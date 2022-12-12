const express = require("express");
const { usercreate ,userlogin ,forget_password ,reset_password} = require("../controller/usercontroller");
const {createstudent ,getstudent,updatestudent,deletestudent} = require("../controller/studentcontroller");
const {Authentication ,Authorization} = require("../middleware/auth")
const router = express.Router();


router.post( "/user/register" , usercreate);

router.get("/user/login" ,userlogin);

router.post("/api/forget-password" ,Authentication ,forget_password);

router.get("/api/reset-password" ,Authentication ,reset_password);

router.post("/student/fillingdetails" ,Authentication ,Authorization ,createstudent);

router.get("/student/data" ,Authentication ,Authorization ,getstudent)

router.put("/student/update" ,Authentication ,Authorization ,updatestudent);

router.delete("/student/delete" ,Authentication ,Authorization,deletestudent);

module.exports = router;
