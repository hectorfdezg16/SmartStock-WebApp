const userCtrl = {}

//we require a model from models folder
const User = require('../models/User');

//we require the info of the jsonwebtoken module
const jwt = require('jsonwebtoken');

//our User's CRUD
userCtrl.getAllUsers = async (req, res) => {

    const users = await User.find()
    res.json(users)
}

userCtrl.createUser = async (req, res) => {

    console.log(req.body)

    //we create this object to not take user's id
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });

    console.log(newUser);

    //this takes some time!
    await newUser.save()
    res.send({message: '¡Ya estás registrado en el sistema!'})
}

userCtrl.deleteUser = async (req, res) => {
    
    console.log(req.params)

    await User.findByIdAndDelete(req.params.id)

    res.json({status: 'Usuario eliminado correctamente'})
}

userCtrl.updateUser = async (req, res) => {

    console.log(req.params)

    //we obtain id before we give it
    const { id } = req.params;

    //we want to modify this object with these parameters
    const modifiedUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }

    //if any parameter doesn't exist we create it
    await User.findByIdAndUpdate(id,{$set: modifiedUser}, {new: true})

    res.json({status: 'Usuario actualizado correctamente'})
}

userCtrl.getUser = async (req, res) => {

    console.log(req.params)

    const user = await User.findById(req.params.id)

    res.send(user)
}

userCtrl.logIn = async (req, res) => {

    console.log(req.body);

    const { email, password } = req.body;

    //search the params ({email: email}) ---> next steps encrypt again
    
    //we wait to the search in database (async-await)
    const user = await User.findOne({email})

    if(!user) return res.status(401).send("This email doesn't exist!");

    //& password validator
    if(user.password !== password) return res.status(401).send("Incorrect password!");

    const token = jwt.sign({_id: user._id}, 'secretkey')
    res.status(200).json({token})

}

userCtrl.signUp = async (req, res) => {

    //we see the body of the user's request
    console.log(req.body);

    //we extract the info of the json object
    const { email, username, password, role } = req.body;

    //in the next steps, we encrypt these params
    const newSignUpUser = new User({email, username, password, role});

    await newSignUpUser.save();

    //then, we create a token (payload, variable & options)
    const token = jwt.sign({_id: newSignUpUser._id}, 'secretkey')

    //we return the json object with the created token to the user & status = OK
    res.status(200).json({token})
}

userCtrl.getBackOffice = (req, res)=>{
    res.status(200).send('All OK!');
}

userCtrl.getProfile = (req, res)=>{
    res.status(200).send('All OK!');
}

module.exports = userCtrl;