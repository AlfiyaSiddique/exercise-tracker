import dbMethods from "../models/databaseMethods.js";

const getUserPage = async (req,res)=>{
    const userData = await dbMethods.findSomeThingById(req.params.id);
    const allExercises = await dbMethods.findExercises(req.params.id);
    return res.render("user", {username: userData.username, exercises: allExercises});
}

const addUserExercise =  (req,res)=>{
    const newExercise = {...req.body, userid: req.user._id};
    dbMethods.addExercise(newExercise);
    res.redirect(`/user/${req.user._id}/page`)
}

const deleteUserExercise = async (req, res)=>{
   await dbMethods.deleteDoc(req.body._id);
    res.redirect(`/user/${req.body.userid}/page`)
}

const userController = {
    getUserPage: getUserPage,
    addUserExercise: addUserExercise,
    deleteUserExercise: deleteUserExercise
}

export default userController;
