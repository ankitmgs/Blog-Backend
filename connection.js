const mongoose = require("mongoose");
require("dotenv").config()

const db_url = process.env.DB_URL
// console.log("fddfed",db_url)

mongoose.connect(db_url).then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log("error ",err)
});

module.exports = mongoose;