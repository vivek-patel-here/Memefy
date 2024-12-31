const mongoose=require("mongoose");

async function main(url){
    await mongoose.connect(url);
}

module.exports={main};