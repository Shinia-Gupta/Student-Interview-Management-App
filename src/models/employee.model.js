import mongoose from "mongoose";

const empSchema=new mongoose.Schema({
    name:{type:String,required:[true,'Name is required']},
    email:{type:String,required:[true,'Email is required'],unique:[true,'Email already exists! Please login to continue'],match:[/.+\@.+\../,'Please enter a valid email']},
    password:{type:String,required:[true,'Password is required']}
});
export const empModel=mongoose.model('employee',empSchema);