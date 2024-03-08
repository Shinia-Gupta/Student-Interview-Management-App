import { interviewModel } from '../models/interview.model.js';
import linkedIn from 'linkedin-jobs-api';
import axios from "axios";
export class InterviewController {
  getInterviews = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Get current page number from query parameters, default to 1
    const limit = 3; // Number of records per page
    const skip = (page - 1) * limit; // Calculate skip value

    const interviews = await interviewModel.find({}).skip(skip).limit(limit);
    const totalCount = await interviewModel.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / limit);
    res.render("interviewList", {
      useremail: req.user.email,
      username: req.user.name,
      interviews,
      totalPages,
      currentPage: Number(page),
    });
  };

  getaddInterviewForm = (req, res) => {
    res.render("addInterview", {
      useremail: req.user.email,
      username: req.user.name,
    });
  };

  addInterview = async (req, res, next) => {
    const newinterview = new interviewModel({
      interview_Company: req.body.company,
      interview_Date: req.body.date,
      students: [],
    });
    await newinterview.save();
    res.redirect("/app/interviews/all");
  };

  getJobs = async (req, res, next) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: 'React JS and Node JS developer in India',
                num_pages: '3' // Example: Fetching first 3 pages of results
            },
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
            }
        };

        let allJobs = []; // Array to store all job results

        // Fetch the specified number of pages
        for (let page = 1; page <= parseInt(options.params.num_pages); page++) {
            options.params.page = page; // Set the page number in the request options

            const response = await axios.request(options);
            const data = response.data.data;

            allJobs = allJobs.concat(data); // Concatenate the new page of jobs to the existing array
        }

        if(req.cookies.jwttoken)
        res.render('jobs', { data: allJobs,useremail:req.user.email,username:req.user.name });
      else
      res.render('jobs', { data: allJobs,useremail:null,username:null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

}

