import mongoose from "mongoose";

const interviewSchema=new mongoose.Schema({
    interview_Company:{type:String},
    interview_Date:String,
    
    students:[{type:mongoose.Schema.Types.ObjectId,ref:'Student'}]
});
export const interviewModel=mongoose.model('interview',interviewSchema);