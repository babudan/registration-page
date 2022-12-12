const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        teachername : {
            type : String,
            required : true
        },
        phoneno : {
            type : String,
            required : true,
            unique : true
        },
        adress : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        token : {
            type : String,
            default : ''
        }
    },{timestamps : true}
);

module.exports = mongoose.model("newuser" ,userSchema);