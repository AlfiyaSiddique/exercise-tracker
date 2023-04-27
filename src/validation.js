import { check } from "express-validator";

const validationUserInfo = [
  check("email", "Invalid email").isEmail().trim(),
  check("username", "Username must be atleast 6 chars long").isLength({min: 6}),
  check("password", "Password must be atleast 5 chars long").isLength({min: 5}),
  check("cpassword", "Password Confirmation does not match password").custom((value, {req})=>{
    return value === req.body.password;
  })
]

const validation = {
    validationUserInfo: validationUserInfo
}

export default validation;
