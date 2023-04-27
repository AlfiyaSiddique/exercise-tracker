import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: String,
    googleId: String,
    facebookId: String
})

const freecodecampUserSchema = mongoose.Schema({
  username: {
        type: String,
        require: true
  }
})

const freecodecampExerciseSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true 
  },
  description: {
      type: String,
      require: true
  },
  duration: {
     type: Number,
      require: true
  },
  date:{
    type: Date, 
    default: Date.now
  }
})

const exerciseSchema = mongoose.Schema({
 userid : {
    type: String,
    require: true
 },
 exerciseName:{
    type: String,
    require: true
 } ,
 description: {
    type: String,
    require: true
 },
 duration: {
    type: String,
    require: true
 },
 date: {
    type: String,
    require: true
 }
})

const User = mongoose.model("user", userSchema);
const Exercise = mongoose.model("exercise", exerciseSchema);
const freecodecamp = mongoose.model("fccUser", freecodecampUserSchema);
const fccExercise = mongoose.model("fccExercise", freecodecampExerciseSchema);

const database = {
    userModel : User,
    exerciseModel: Exercise,
  fccModel: freecodecamp,
  fccExerciseModel: fccExercise
}

export default database;



