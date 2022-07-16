const { model } = require('mongoose');
const User = require('../modal/user_modal')
const jwt=require("jsonwebtoken")
const genToken = user => {
    const {email}=user
    console.log(email);
    return jwt.sign({email,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, 'secretkey');
  }

const register = async (req, res, next) => {

   try{
    const { email, password } = req.body;
    console.log({ email, password });
    //Check If User Exists
    let foundUser = await User.findOne({ email });
    if (foundUser) {
        return res.status(403).json({ error: 'Email is already in use' });
    }

    const newUser = new User({ email, password })
    await newUser.save()  // Generate JWT token
    const token = genToken(newUser)
    console.log(token);
    res.status(200).json({ token })
   }
   catch(err){
    res.send(500)
   }

}
module.exports= register