import { validationResult } from "express-validator";
import database from "../models/database.js";
import dbMethods from "../models/databaseMethods.js";

const postSignupControl = async (req, res) => {
  const errors = [];
  const isError = validationResult(req);

  if (!isError.isEmpty()) {
    const allError = Object.values(isError.mapped());
    allError.forEach((err) => {
      errors.push(err.msg);
    });
    req.flash("errors", errors);
    return res.redirect("/signup");
  } else {
   const userNotExist =  await dbMethods.doesValueNotExist({ email: req.body.email })
   if(userNotExist){
      const addUsertoDatabase =  await dbMethods.createUser(req.body);
        return res.redirect(`/user/${addUsertoDatabase._id}/page`)
     
   }else{
    req.flash("errors", "User already exists with this email.");
    return res.redirect("/signup");
   }  
  }
};

const postLoginControl =  (useremail, userpassword) => {
  const result =  database.userModel.findOne({email: useremail})
    .then(async user=>{
      if(user){
        const passwordEqual = await dbMethods.comparePassword(userpassword, user.password);
        if(passwordEqual)  return user;
        else{return false}
      }else{
        return false;
      }
     })
    .catch(e=>{
      console.log(e)
    })
    return result;
};

const entryController = {
  postSignupControl: postSignupControl,
  postLoginControl: postLoginControl,
};

export default entryController;
