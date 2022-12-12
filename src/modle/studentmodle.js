const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;


const studentSchema = new mongoose.Schema( 
    {
        studentname : {
            type : String,
            required : true
        },
        subject : {
            type : String,
            required : true
        },
        Marks : {
            type : Number,
            require : true
        },
        teacherid : {
        type : objectId,
        ref : "newuser"
        },
        isdeleted : {
            type : Boolean,
            default : false
        }

    } ,{timestamps : true});

    module.exports = mongoose.model("newstudent" ,studentSchema);