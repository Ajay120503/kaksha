const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  classroom:{ type:mongoose.Schema.Types.ObjectId, ref:"Classroom" },
  title:String,
  description:String,
  deadline:Date,
  maxMarks:Number,
  attachments:[String]
},{timestamps:true});

module.exports = mongoose.model("Assignment",assignmentSchema);
