const studentmodle = require("../modle/studentmodle");
const usermodle = require("../modle/usermodle");
const {isValid,isValidName ,isNumber} = require("../validator/validations");
const { default: mongoose } = require("mongoose");

const createstudent = async (req,res) => {
         try {
               let data = req.body;
               const decodedToken = req.user;

            let {studentname ,subject ,Marks} = data;   
               if(Object.keys(data).length == 0) return res.status(400).send({status:false ,message:"plss put some data in the body"}) 
               
               if ( !isValid(studentname) || !isValidName(studentname)) return res.status(400).send({ status: false, message: "plss put the username or put a valid username" })
  
               if(!isValid(subject) || !isValidName(subject)) return res.status(400).send({ status: false, message: "plss put the subject or put a valid subject" })

               if(!isNumber(Marks)) return res.status(400).send({ status: false, message: "plss put the Marks or put a valid Marks in string formate" })

                let newid = decodedToken._id;
               let newlyteacher = await usermodle.findOne({ _id : newid});

               let teacherid = newlyteacher._id;

               let createstudent = await studentmodle.findOne({$and : [{studentname} ,{subject} ,{teacherid : teacherid}]});
               if(createstudent) {  
               let updatestudent = await studentmodle.findOneAndUpdate({$and : [{teacherid : teacherid} ,{_id:createstudent._id}] },{$inc : {Marks : +Marks}} , {new:true});
               return res.status(201).send({status:true, message : "Student marks updated succesfully", data : updatestudent});
               }
               else {
               let oldstudent = {
                studentname : studentname,
                     subject : subject,
                     Marks : Marks,
                     teacherid : teacherid
               }
               let newstudent = await studentmodle.create(oldstudent);
               return res.status(201).send({status:true, message : "Student created succesfully", data : newstudent});
            }

        }catch(err){
        return res.status(400).send({status:false ,message : err.message});

} 
};

const getstudent = async (req,res) => {
    try {
             let data = req.query;
            let{studentname ,subject ,Marks} = data;
            const decodedToken = req.user;
            let newid = decodedToken._id;

            if(Object.keys(data).length == 0) return res.status(400).send({status:false ,message:"plss put some data in the body"}) 
             
            if(studentname){
            if ( !isValid(studentname) || !isValidName(studentname)) return res.status(400).send({ status: false, message: "plss put the username or put a valid username" })
            }
            
            if(subject){
                if ( !isValid(subject) || !isValidName(subject)) return res.status(400).send({ status: false, message: "plss put the subject or put a valid subject" })
                }

            if(Marks){
            if(!isNumber(Marks)) return res.status(400).send({ status: false, message: "plss put the Marks or put a valid Marks in string formate" })
            }

            let findteacher = await usermodle.findOne({_id : newid}).lean();
             
            let findstudent = await studentmodle.find( { $and : [{teacherid : findteacher._id} , data]});

            if(!findstudent || findstudent.isdeleted == true) return res.status(400).send({status : false, message : "student is not exist in the database or it is already deleted"})

            findteacher.studentdetails = findstudent
  
             return res.status(200).send({status:true ,message:"get all the data of student" ,data:findteacher});

    }catch(err){
        return res.status(400).send({status:false ,message : err.message});
    }
}

const updatestudent = async (req,res) => {
      try {
        let data = req.body;
        let{studentname ,subject,Marks} = data;
        let newdata = req.query
        let {studentid} = newdata;
        const decodedToken = req.user;
        let newid = decodedToken._id;

        if(Object.keys(data).length == 0) return res.status(400).send({status:false ,message:"plss put some data in the body"}) 

        if(!mongoose.Types.ObjectId.isValid(studentid))  return res.status(400).send({status : false,message:"student id is not valid"})
        
        if(studentname){
        if ( !isValid(studentname) || !isValidName(studentname)) return res.status(400).send({ status: false, message: "plss put the username or put a valid username" })
        }
        
        if(subject){
            if ( !isValid(subject) || !isValidName(subject)) return res.status(400).send({ status: false, message: "plss put the subject or put a valid subject" })
            }

        if(Marks){
        if(!isNumber(Marks)) return res.status(400).send({ status: false, message: "plss put the Marks or put a valid Marks in string formate" })
        }
        
        let findteacher = await usermodle.findOne({_id : newid}).lean();
      
        let updatestudent = await studentmodle.findOneAndUpdate({$and : [{teacherid : findteacher._id} ,{_id:studentid}] },{ $set: {studentname ,subject, Marks}} , {new:true});
      
        if(!updatestudent || updatestudent.isdeleted == true) return res.status(400).send({status : false, message : "student is not able to update or it is already deleted"})
        findteacher.studentdetails = updatestudent

        return res.status(200).send({status:true ,message:"update all the data of student" ,data:findteacher});

      }catch(err){
        return res.status(400).send({status:false ,message : err.message});
    }
}

const deletestudent = async (req,res) => {
    try {
        let newdata = req.query
        let {studentid} = newdata;
        const decodedToken = req.user;
        let newid = decodedToken._id;
      
        let findteacher = await usermodle.findOne({_id : newid}).lean();
        if(!mongoose.Types.ObjectId.isValid(studentid))  return res.status(400).send({status : false,message:"student id is not valid"})
        
        let findnewstudent = await studentmodle.findOne({$and : [{teacherid : findteacher._id} ,{_id:studentid}] });
        if(!findnewstudent || findnewstudent.isdeleted==true) return res.status(400).send({status : false, message : "student is not able to update or it is already deleted"});

        let deletedstudents = await studentmodle.findOneAndUpdate({$and : [{teacherid : findteacher._id} ,{_id:studentid}] },{ $set: {isdeleted : true}} , {new:true});
      
        findteacher.studentdetails = deletedstudents

        return res.status(200).send({status:true ,message:"update all the data of student" ,data:findteacher});

    }catch(err){
        return res.status(400).send({status:false ,message : err.message});
    }
}

module.exports = {createstudent,getstudent,updatestudent,deletestudent };