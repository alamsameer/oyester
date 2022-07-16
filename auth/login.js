const { model } = require('mongoose');
const User = require('../modal/user_modal')
const jwt = require("jsonwebtoken")
const genToken = user => {
    const { email } = user
    console.log(email);
    return jwt.sign({
        email,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, 'secretkey');
}

const login = async (req, res,) => {

    try {
        const { email, password } = req.body;
        // console.log({ email, password });/
        //Check If User Exists
        let foundUser = await User.find({ email, password });
        console.log(foundUser);
        if (!foundUser) {
            // Generate JWT token
            return res.status(404).send("user not found")
        }
        const token = genToken(foundUser)
        console.log(token);
        res.status(200).json({ token })
    }
    catch (err) {
        console.log(err);
        res.send(500)
    }

}
module.exports = login