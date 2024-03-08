import mongoose from "mongoose";
import { ObjectId } from "mongodb";
const studSchema=new mongoose.Schema({
    student_Name:String,
    student_College: String,
    student_Email: String,
    student_Batch: String,
    student_Placement_Status:{type:String,enum:['placed','Not placed'],default:'Not placed'},
    student_DSA_Score:{type:Number,default:0},
    student_Webd_Score:{type:Number,default:0},
    student_React_Score:{type:Number,default:0},
    interviews:[
        {
            interviewId:{type:String},
            interview_Date:{type:String},
            interview_Company: {type:String},
            interview_Result: {type:String,enum:['Pass','Fail','On Hold','Did not attempt'],default:'Did not attempt',required:true},
        }
    ]
});

studSchema.methods.setInterviews = async function(data) {
    const student = this;
    student.interviews.push({
        interviewId: data.interview._id,
        interview_Date: data.interview.interview_Date,
        interview_Company: data.interview.interview_Company,
        interview_Result: data.interview_Result
    });
    await student.save();
    return student;
}
export const studModel=mongoose.model('student',studSchema);