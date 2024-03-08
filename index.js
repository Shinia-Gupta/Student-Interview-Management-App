import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

import empRouter from "./src/routes/employee.routes.js";
import iRouter from "./src/routes/interview.routes.js";
const app = express();
app.use(express.json());
app.use(express.static("src/views"));

app.use(cookieParser());
app.use((req, res, next) => {
  // Check if useremail and username are available in locals
  res.locals.useremail = req.user ? req.user.email : null;
  res.locals.username = req.user ? req.user.name : null;
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));
app.use(expressEjsLayouts);

app.use('/',empRouter);
app.use("/app/interviews", iRouter);
export default app;
