import database from "./database.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongoose";
const saltRounds = 7;

const createUser = async (user) => {
  let hashedPassword = await bcrypt.hash(user.password, saltRounds);
  let userData = { email: user.email, username: user.username, password: hashedPassword};
  const newUser = new database.userModel(userData);
  const savedUser = newUser
    .save()
    .then((createdUser) => {
      return createdUser;
    })
    .catch((error) => {
      console.log(error);
    });
  return savedUser
};

const fccUser = async (user)=>{
  const newfccUser = await new database.fccModel(user);
  const savedUser = newfccUser
    .save()
    .then((createdUser) => {
      return createdUser;
    })
    .catch((error) => {
      console.log(error);
    });
  return savedUser
}

const doesValueNotExist = async (newUserData) => {
  const isExist = await database.userModel
    .countDocuments(newUserData)
    .then((count) => {
      if (count > 0) {
        return false;
      } else {
        return true;
      }
    })
    .catch((e) => {
      return e + "";
    });

  return isExist;
};

const findSomeThingById = async (id)=>{
  const user = await database.userModel.findById(id);
  return user;
}

const findAndUpdate =  (user)=>{
  return new Promise(async (resolve, reject)=>{
    try{
      const newuser = await database.userModel.findOneAndUpdate({email: user.email}, {$setOnInsert: user}, {new: true, upsert: true});
       resolve(newuser);
    }catch(e){
       reject(e)
    }
  })
  
}

const comparePassword = async (password, hash)=>{
   const isEqual = await bcrypt.compare(password, hash);
   return isEqual;
}

const addExercise = (exercise)=>{
  const newExercise = new database.exerciseModel(exercise);
  newExercise.save();
}

const findExercises = async (user_id)=>{
  const exercises = await  database.exerciseModel.find({userid: user_id})
  return exercises;
}

const findAll = async (model)=>{
  const result = await model.find({});
  return result;
}

const fccAddExercise = async (userid, exercise)=>{
  const user = await database.fccModel.findById(userid);
     let description = exercise.description;
	   let duration = exercise.duration;
	   let date = (exercise.date !== undefined ? new Date(exercise.date) : new Date());
      
      let newExercise =  new database.fccExerciseModel({
				userId: userid,
				description: description,
				duration: duration,
				date: date
			});

     let savedExercise = await newExercise.save().then(result=>{
              return result
            })
  
      return {_id: userid,
                 username: user.username,
                 description: savedExercise.description,
                duration :savedExercise.duration,
                date: new Date(savedExercise.date).toDateString()
              };
  }

  const deleteDoc = async (id)=>{
     await database.exerciseModel.deleteOne({_id: id}).then(res=>console.log(res))
  }

const dbMethods = {
  createUser: createUser,
  doesValueNotExist: doesValueNotExist,
  findSomeThingById: findSomeThingById,
  findAndUpdate: findAndUpdate,
  comparePassword: comparePassword,
  addExercise: addExercise,
  findExercises: findExercises,
  fccUser: fccUser,
  findAll: findAll,
  fccAddExercise: fccAddExercise,
  deleteDoc: deleteDoc
};

export default dbMethods;
