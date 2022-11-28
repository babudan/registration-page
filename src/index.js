const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/route")
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded( {extended : true}));

mongoose.connect(process.env.DB ,{
    useNewUrlParser:true
})
.then(() => console.log("mongodb is connected"))
.catch(err => console.log(err))

app.use("/" ,router)

//----------handling wrong api edge case--------------------------------------------
app.use((req, res, next) => {
    res.status(404).send({ status: false, error: "path not found" });
})

app.listen(process.env.PORT , () => {
      console.log(`Express app running on port ${process.env.PORT}`)
})