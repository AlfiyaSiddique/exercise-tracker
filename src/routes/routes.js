import { Router } from "express";
import homeControllers from "../controllers/homeController.js";
import entryController from "../controllers/entryController.js";
import userController from "../controllers/userControllers.js";
import validation from "../validation.js";
import passport from "passport";
import fccControllers from "../controllers/fccControllers.js";

const router = Router();

const allRoutes = (app)=>{
  
    router.get("/", homeControllers.getHomePage);
    router.get("/login", homeControllers.getLoginPage)
    router.get("/signup", homeControllers.getSignUpPage)
    router.get("/getGoogleAuth", passport.authenticate("google", {scope: ["profile","email"]}));
    router.get("/googleAuth", passport.authenticate("google", { failureRedirect: "/signup" }), function(req, res) {
        res.redirect(`/user/${req.user._id}/page`)
      });
    router.get("/getFacebookAuth", passport.authenticate("facebook", {scope: ["email"]}));
    router.get("/facebookAuth", passport.authenticate("facebook", {failureRedirect: "/signup"}), function(req, res) {
       res.redirect(`/user/${req.user._id}/page`)
    });
  router.get("/user/:id/page", userController.getUserPage);
   router.get("/about", homeControllers.getAboutPage)
   router.get("/tips", homeControllers.getTipsPage)
    router.get("/logout", (req,res)=>{
      req.session.destroy((err)=>{
        return res.redirect("/")
      })
    })

 

    router.post("/login",  passport.authenticate("local", {failureRedirect: "/login"}), (req,res)=>{
      res.redirect(`/user/${req.user._id}/page`)
    })
    router.post("/signup", validation.validationUserInfo ,entryController.postSignupControl)
    router.post("/exercise", userController.addUserExercise)
    router.post("/delete", userController.deleteUserExercise)
    router.post("/tips", homeControllers.postTips)

  

  // Freecodecamp Routes
  router.get("/api/users", fccControllers.getAllUser)
  router.get("/api/users/:_id/logs", fccControllers.getOneUser)
  router.post("/api/users", fccControllers.createUser)
  router.post("/api/users/:_id/exercises", fccControllers.addExercise)

    return app.use("/", router);

}

export default allRoutes;
