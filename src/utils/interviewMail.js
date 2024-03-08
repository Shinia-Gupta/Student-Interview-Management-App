// Import the necessary modules here
import nodemailer from "nodemailer";

export const sendInterviewMail = async (student, interview) => {
  // Write your code here
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "codingninjas2k16@gmail.com",
      pass: "slwvvlczduktvhdj",
    },
  });
  const mailContent = `An interview has been scheduled for ${student.student_Name} in ${interview.interview_Company} on ${interview.interview_Date}. Please be available for the interview. Further details will be communicated through ${interview.interview_Company}.`;
  let mailoptions = {
    from: "codingninjas2k16@gmail.com",
    to: student.student_Email,
    subject: `Congratulations! Interview Scheduled with ${interview.interview_Company}`,
    text: mailContent,
  };
  try {
    transporter.sendMail(mailoptions, function (error, info) {
      if (error) {
        console.log(error);
        throw error;
        // throw new Error('Email could not be sent. Please check your internet connection');
      } else {
        console.log("Success: Email sent to " + student.student_Email);
      }
    });
  } catch (error) {
    // console.log('Sucess: Email sent to '+recieverMail);
    console.log("Email failed with error-" + error);
    // throw error;
    if (error.code === "EDNS")
      throw "Email could not be sent. Please check your internet connection";
  }
};
