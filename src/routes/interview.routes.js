import express from "express";
import { InterviewController } from "../controllers/interview.controller.js";
import jwtAuth from "../middlewares/jwtAuth.middleware.js";
const iController=new InterviewController();
const iRouter=express.Router();

iRouter.get('/all',jwtAuth,iController.getInterviews);
iRouter.get('/add',jwtAuth,iController.getaddInterviewForm);
iRouter.post('/add',jwtAuth,iController.addInterview);
iRouter.get('/jobs',jwtAuth,iController.getJobs);
export default iRouter;