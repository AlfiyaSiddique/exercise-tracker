import dbMethods from "../models/databaseMethods.js";
import database from "../models/database.js";

const createUser = async (req, res)=>{
  const createdUser = await dbMethods.fccUser(req.body);
  return res.json(createdUser);
}

const getAllUser = async (req, res)=>{
  const allUsers = await dbMethods.findAll(database.fccModel);
  return res.json(allUsers);
}

const getOneUser = async (req, res)=>{
  const user = await database.fccModel.findById(req.params._id);
  let exercise = await database.fccExerciseModel.find({userId: user._id});

  if(req.query.limit){
    exercise =  await database.fccExerciseModel.find({userId: user._id}).limit(req.query.limit);
  }
  const result = {
    _id: req.params._id,
						username: user.username,
						count: exercise.length,
						log: exercise.map(function (e) {
							return {
								description: e.description,
								duration: e.duration,
								date: new Date(e.date).toDateString()
							};
              })
          }
  return res.json(result);
}

const addExercise = async (req, res)=>{
  const result = await dbMethods.fccAddExercise(req.params._id, req.body);
  return res.json(result);
}

const fccControllers  = {
  createUser: createUser,
  getAllUser: getAllUser,
  getOneUser: getOneUser,
  addExercise: addExercise
}

export default fccControllers;