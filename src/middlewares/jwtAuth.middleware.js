import jwt from "jsonwebtoken";

const jwtAuth = async (req, res, next) => {
    // 1. Read the token
    // console.log(req.cookies);
    const token = req.cookies.jwttoken;
    // console.log('jwttoken-',token);
    //2. if no token, return the error
    if (!token) {
        return res.render("login", { errMsg: "Unauthorized" });
    }
    //3. check if token is valid
    //if valid, call next middleware
    //else, return error
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log('payload:---',payload);
        req.user = payload.user;
        // res.redirect('/app/view-students');
    } catch (error) {
        //errors can be caused by invalid token or token expiration or token modification
        return res.render("login", { errMsg: "Unauthorized" });
    }
    next();
};

export default jwtAuth;
