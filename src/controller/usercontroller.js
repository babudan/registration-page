// const { object } = require("webidl-conversions");
const usermodle = require("../modle/usermodle");
const {isValid,isValidEmail,isValidName,isValidadress,isValidNumber,isValidPassword} = require("../validator/validations")
const bcrypt = require("bcrypt")

const nodemailer = require("nodemailer");

const randomstring = require("randomstring");

const sendresetPasswordMail = async(name, email, token) => {
       try {
          const transporter =   nodemailer.createTransport({
                host : "smtp.gmail.com",
                port : 587,
                secure : false,
                requireTLS : true,
                auth : {
                    user : "babudan517@gmail.com",
                    pass : "cnzupbqeyhqgmlde"
                }
            });

            const mailOptions = {
                from : "babudan517@gmail.com",
                to : email,
                subject : 'For reset password',
                html : '<p>  hi '+name+' ,please copy the link and <a href="http://127.0.0.1:3000/api/reset-password?token='+token+'"> reset your password </a>'
            }
            transporter.sendMail(mailOptions ,function(error ,info){
                       if(error){
                          console.log(error);
                       } else {
                        console.log("Mail has been sent :-", info.response);
                       }
            });

       }catch(err){
        return res.status(400).send({status:false ,message : err.message});
    }
}

const usercreate = async (req,res) => {
    try{
         let data = req.body;
            let {Name ,phoneno ,email,adress,password} = data;
              
            if(Object.keys(data).length == 0) return res.status(400).send({status:false ,message:"plss put some data in the body"}) 
          
             if ( !isValid(Name) || !isValidName(Name)) return res.status(400).send({ status: false, message: "plss put the username or put a valid username" })

             if(!isValid(phoneno) || !isValidNumber(phoneno)) return res.status(400).send({status:false, message:"plss put the phoneno or ph number must be starting from 6 and it contains 10 digits"});

             let newphone = await usermodle.findOne({phoneno});
             if(newphone) return res.status(400).send({status:false, message:"phoneno is already present"});
 

             if(!isValid(email) || !isValidEmail(email))  return res.status(400).send({status:false, message:"plss put the email or put a valid email"});

             let newemail = await usermodle.findOne({email});
             if(newemail) return res.status(400).send({status:false, message:"email is already present"});
 

             if(!isValid(adress) || !isValidadress(adress))  return res.status(400).send({status:false, message:"plss put the adress or put a valid adress"});

             if(!isValid(password) || !isValidPassword(password))  return res.status(400).send({status:false, message:"plss put the password or put a password which contains uppercase, lowercase ,numbers and special characters"});

             //-------------------password hashing-------------------
             const hashPassword = await bcrypt.hash(password, 10);
                 data.password = hashPassword

             let newuser = await usermodle.create(data);  
             return res.status(201).send({status:true, message:"user is created succesfully" ,data:newuser})

    }catch(err){
        return res.status(400).send({status:false ,message : err.message});
    }
    
}

const userlogin = async (req,res) => {
    try{
            let newdata = req.body;
            let {email ,password} = newdata;
             
            if(Object.keys(newdata).length == 0) return res.status(400).send({status:false ,message:"plss put some data in the body"}) 


            if(!isValid(email) || !isValidEmail(email))  return res.status(400).send({status:false, message:"plss put the email or put a valid email"});

            if(!isValid(password) || !isValidPassword(password))  return res.status(400).send({status:false, message:"plss put the password or put a valid password"});

            let newemail = await usermodle.findOne({email});
            if(!newemail) return res.status(401).send({status:false, message:"email is not registered"});

            const matchPass = await bcrypt.compare(password, newemail.password);
               if (!matchPass) 
            return res.status(400).send({ status: false, message: "You Entered Wrong password" })

          return res.status(200).send({statu:true, message:"get the user data", data:newemail})
    }catch(err){
        return res.status(400).send({status:false ,message : err.message});
    }
}

const forget_password = async(req ,res) => {
    try {
        let data = req.body;
        let {email} = data;
        if(Object.keys(data).length == 0) return res.status(400).send({status:false ,message:"plss put some data in the body"});

        if(!isValid(email) || !isValidEmail(email))  return res.status(400).send({status:false, message:"plss put the email or put a valid email"});

         const userdata = await usermodle.findOne({email})
        
         if(userdata){
            const randomString = randomstring.generate();
            const newdata = await usermodle.updateOne({email} ,{$set:{token:randomString}});
            sendresetPasswordMail(userdata.Name,userdata.email,randomString);  

            res.status(200).send({status:true ,message: "please check your email and reset the password"})
         }else {
            return res.status(404).send({status:true ,message : "this email does not exist"});
         }

    }catch(error){
        return res.status(400).send({status:false ,message : error.message});
    }
}

const reset_password = async (req,res) => {
    try{
         const token = req.query.token;
         const tokenData = await usermodle.findOne({token:token});
         const password = req.body.password;
           
         if(!isValid(password) || !isValidPassword(password))  return res.status(400).send({status:false, message:"plss put the password or put a valid password"});

         if(tokenData){
             //-------------------password hashing-------------------
             const hashPassword = await bcrypt.hash(password, 10);

      const userData = await usermodle.findByIdAndUpdate({_id : tokenData._id} ,{$set : {password : hashPassword ,token:''}},{new:true}); 
    
       return res.status(200).send({status:true, message:"user password has been reset" ,data:userData})

         }else{
            return res.status(400).send({status:false ,message : "this link is wrong or expired"});
         }

    }catch(error){
        return res.status(400).send({status:false ,message : error.message});
    }
}

module.exports = {usercreate ,userlogin ,forget_password ,reset_password};