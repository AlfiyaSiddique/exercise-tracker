import axios from "axios"

const getHomePage = (req,res)=>{
    if(req.isAuthenticated()){
          res.redirect(`/user/${req.user._id}/page`)
    }else{
        res.render("home")
    }
}

const getAboutPage = (req, res)=>{
 res.render("about")
}

const getTipsPage = (req,res)=>{
  const muscle = "biceps";

  axios.get('https://api.api-ninjas.com/v1/exercises', {
    params: {
        muscle: muscle
    },
    headers: {
        'X-Api-Key': process.env.TIPSAPIKEY
    }
  })
  .then((response)=>{
    res.render("tips", {exercise: response.data, type: "Exercise"})
  })
  .catch((e)=>{
    console.log("Error heath Api")
    console.log(e)
  })
}

const getLoginPage = (req, res)=>{
    res.render("entry", {formName: "Login", errors: req.flash("errors")});
}

const getSignUpPage = (req, res)=>{
    res.render("entry", {formName: "Sign Up", errors: req.flash("errors")});
}

const postTips = (req,res)=>{
    const keyword= req.body.keyword;
    const type = req.body.type;
    let url , paramObject;
    if(type === 'Exercise'){ 
      url = 'https://api.api-ninjas.com/v1/exercises';
      paramObject = {muscle: keyword}
    }else{
    url = 'https://api.api-ninjas.com/v1/nutrition?query='+keyword;
    paramObject={};
    }

    axios.get(url, {
        params:paramObject,
        headers: {
            'X-Api-Key': '4E4S1AUo0WiAeWaoQFO4zg==sNdbLu6FzvYM23RG'
        }
      })
      .then((response)=>{
        console.log(response)
        const finalData = (type === "Exercise")? response.data :response.data[0];
        res.render("tips", {exercise: finalData, type: type})
      })
      .catch((e)=>{
        console.log("Error heath Api")
        console.log(e)
      })

}

const homeControllers =  {
    getHomePage : getHomePage,
    getLoginPage: getLoginPage,
    getSignUpPage: getSignUpPage,
    getAboutPage: getAboutPage,
    getTipsPage: getTipsPage,
    postTips: postTips
}

export default homeControllers;
