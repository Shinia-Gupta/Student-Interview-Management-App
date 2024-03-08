import jwt from "jsonwebtoken";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import bcrypt from 'bcrypt'
import { empModel } from "../models/employee.model.js";
import { studModel } from "../models/student.model.js";
import { interviewModel } from "../models/interview.model.js";
import { sendInterviewMail } from "../utils/interviewMail.js";
export class EmployeeController {

  //Function to get employee registration form
  getRegister(req, res) {
    res.render("register", {
      errMsg: null,
    });
  }

  //Employee Registration Function
  registerEmployee = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.render("register", { errMsg: "Both Fields are required" });
      }
      const emp=await empModel.findOne({email});
      if(emp) return res.render('login',{errMsg:'Please login. You are already registered by this email'})
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt of 10 rounds
      const newUser = new empModel({ name:req.body.name,email, password: hashedPassword });
      await newUser.save();
      res.render("login", { errMsg:null});
    } catch (error) {
      console.log(error);
      res.render("register", { errMsg: "Something went wrong on our end. Please try again later" });
    }
  };
  

  //Function to get employee login form
    getLogin = (req, res) => {
    res.render("login", { errMsg: null });
  };

  
  //Employee Login Function
  loginEmployee = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.render("login", { errMsg: "Both Fields are required" });
      }
      const validUser = await empModel.findOne({ email });
      if (validUser) {
        const isPasswordValid = await bcrypt.compare(password, validUser.password); // Compare the hashed password with the provided password
        if (isPasswordValid) {
          // Authentication successful
          const token = await jwt.sign({ user: validUser }, process.env.JWT_SECRET, { expiresIn: "2h" });
          res.cookie("jwttoken", token, { maxAge: 2 * 60 * 60 * 1000 });
          const students = await studModel.find({});
          res.render("studentsList", {
            useremail: validUser.email,
            username: validUser.name,
            students,
            errMsg: null,
          });
        } else {
          // Invalid credentials
          res.render("login", { errMsg: "Invalid Credentials!" });
        }
      } else {
        // Email not found
        res.render("login", { errMsg: "Email does not exist! Please register to continue" });
      }
    } catch (error) {
      console.log(error);
      res.render("login", { errMsg: "Something went wrong on our end. Please try again later" });
    }
  };
  
  //Function to get students list
    getAllStudents = async (req, res, next) => {

    const students = await studModel.find({});

    // Pass pagination information to the template
    res.render("studentsList", {
      useremail: req.user.email,
      username: req.user.name,
      students,
      errMsg: null,
    });
  };

  //Function to get add student form
  getaddStudent = (req, res, next) => {
    res.render("addStudent", {
      useremail: req.user.email,
      username: req.user.name,
      errMsg: null,
    });
  };

  //Function to add a student
  addStudent = async (req, res, next) => {
    const studExists = await studModel.findOne({
      student_Email: req.body.email,
    });
    if (studExists)
      return res.render("addStudent", {
        useremail: req.user.email,
        username: req.user.name,
        errMsg: "Student already exists",
      });
    const newStudent = new studModel({
      student_Name: req.body.name,
      student_College: req.body.college,
      student_Email: req.body.email,
      student_Batch: req.body.batch,
      student_Placement_Status: req.body.status,
      student_DSA_Score: Number(req.body.dscore),
      student_Webd_Score: Number(req.body.wscore),
      student_React_Score: Number(req.body.rscore),
    });
    await newStudent.save();
    const students = await studModel.find({});
    // console.log(students);
    res.render("studentsList", {
      useremail: req.user.email,
      username: req.user.name,
      students,
      errMsg: null,
    });
  };

  //Function to get schedule interview form
  getarrangeInterviewForStudent = (req, res, next) => {
    console.log(req.query);
    const studentId=req.query.studentId;

    if(studentId)
    res.render("scheduleInterview", {
      useremail: req.user.email,
      username: req.user.name,
      studentId:studentId,
      errMsg: null,
    });
    else
    res.render("scheduleInterview", {
      useremail: req.user.email,
      username: req.user.name,
      studentId:null,
      errMsg: null,
    });
  };

  //Function to schedule an interview and send a mail for the same
  arrangeInterviewForStudent = async (req, res, next) => {
    const student = await studModel.findById(req.body.studentId);
    const interview = await interviewModel.findById(req.body.interviewId);
    if (student && interview) {
      // console.log('interview id-',interview._id);
      // console.log(interview);

      // Check if the student is already scheduled for the interview
      const studAlreadyApplied = interview.students.findIndex(
        (s) => s.toString() === student._id.toString()
      );
      // console.log(studAlreadyApplied);
      if (studAlreadyApplied !== -1) {
        return res.render("scheduleInterview", {
          useremail: req.user.email,
          username: req.user.name,
          studentId:null,
          errMsg: "Student already scheduled",
        });
      }
      const interviewScheduled = await student.setInterviews({
        interview,
        interview_Result: "Did not attempt",
      });
      // console.log(interviewScheduled,'interviewwww');
      interview.students.push(student._id);
      await interview.save();
      const mailSent = await sendInterviewMail(student, interview);
      console.log(mailSent);
      const students = await studModel.find({});
      return res.render("studentsList", {
        useremail: req.user.email,
        username: req.user.name,
        students,
        errMsg: null,
      });
    } else {
      return res.render("scheduleInterview", {
        useremail: req.user.email,
        username: req.user.name,
        studentId:null,
        errMsg: "Please enter valid interview id or student id",
      });
    }
  };

  // Function to get the status update form
  getInterviewStatus = async (req, res, next) => {
    // console.log('update interview query 1',req.query);

    const interview = await interviewModel.findById(req.query.interviewId);
    const student = await studModel.findById(req.query.studentId);
    // console.log('interview,student',interview,student);

    res.render("updateInterview", {
      useremail: req.user.email,
      username: req.user.name,
      student,
      interview,
      errMsg: null,
    });
  };

  
  //Function to update the placement status and result status of a student 
  setInterviewStatus = async (req, res, next) => {
    try {
      const student = await studModel.findById(req.body.studentId);
      const interviewIndex = student.interviews.findIndex(
        (i) => i.interviewId.toString() === req.body.interviewId.toString()
      );
      if (interviewIndex !== -1) {
        student.interviews[interviewIndex].interview_Result =
          req.body.resStatus;
        student.student_Placement_Status = req.body.status;

        await student.save();
        const students = await studModel.find({});
        res.render("studentsList", {
          useremail: req.user.email,
          username: req.user.name,
          students,
          errMsg: null,
        });
      } else {
        res.render("studentsList", {
          useremail: req.user.email,
          username: req.user.name,
          students: [],
          errMsg: "Interview not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };

  //Function to filter students based on company name, company id or student name
  searchStudents = async (req, res, next) => {
    try {
      const query = req.query.query;
      const students = await studModel.find({
        $or: [
          { "interviews.interview_Company": query },
          { "interviews.interviewId": query },
          {"student_Name":query}
        ],
      });
      if (students.length > 0)
        res.render("studentsList", {
          useremail: req.user.email,
          username: req.user.name,
          students,
          errMsg: null,
        });
      else
        res.render("studentsList", {
          useremail: req.user.email,
          username: req.user.name,
          students,
          errMsg: "No students interviewed yet",
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };

// Function to download student information as a csv file
  downloadCsv = async (req, res, next) => {
    try {
      const students = await studModel.find({});

      const flattenedStudents = [];
      students.forEach((student) => {
        student.interviews.forEach((interview) => {
          flattenedStudents.push({
            student_Name: student.student_Name,
            student_College: student.student_College,
            student_Email: student.student_Email,
            student_Batch: student.student_Batch,
            student_Placement_Status: student.student_Placement_Status,
            student_DSA_Score: student.student_DSA_Score,
            student_Webd_Score: student.student_Webd_Score,
            student_React_Score: student.student_React_Score,
            interviewId: interview.interviewId,
            interview_Date: interview.interview_Date,
            interview_Company: interview.interview_Company,
            interview_Result: interview.interview_Result,
          });
        });
      });

      const csvWriter = createObjectCsvWriter({
        path: "students.csv",
        header: [
          { id: "student_Name", title: "Student Name" },
          { id: "student_College", title: "Student College" },
          { id: "student_Email", title: "Student Email" },
          { id: "student_Batch", title: "Student Batch" },
          { id: "student_Placement_Status", title: "Placement Status" },
          { id: "student_DSA_Score", title: "DSA Score" },
          { id: "student_Webd_Score", title: "WebD Score" },
          { id: "student_React_Score", title: "React Score" },
          { id: "interviewId", title: "Interview ID" },
          { id: "interview_Date", title: "Interview Date" },
          { id: "interview_Company", title: "Interview Company" },
          { id: "interview_Result", title: "Interview Result" },
        ],
      });

      csvWriter.writeRecords(flattenedStudents).then(() => {
        res.download("students.csv", "students.csv", (err) => {
          if (err) {
            console.error("Error downloading file:", err);
          } else {
            fs.unlinkSync("students.csv");
          }
        });
      });
    } catch (err) {
      console.error("Error generating CSV:", err);
      res.status(500).send("Error generating CSV");
    }
  };

  //Function for employee signout
  logout = async (req, res, next) => {
    try {
      res.clearCookie("jwttoken"); // Clear the JWT token cookie
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.redirect("/login"); // Redirect to the login page
      });
    } catch (error) {
      console.error("Logout Error:", error);
      res.redirect("/login"); // Redirect to the login page even if an error occurs
    }
  };
}
