const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
 classroom:{ type:mongoose.Schema.Types.ObjectId, ref:"Classroom" },
 title:String,
 file:String
},{timestamps:true});

module.exports = mongoose.model("Material",materialSchema);
