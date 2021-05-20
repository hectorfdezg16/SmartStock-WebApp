//we require a model from models folder and the interface of this model
import User, { IUser } from '../models/user';
import { Request, Response } from 'express';
//we require the info of the jsonwebtoken module
import jwt from 'jsonwebtoken';

class userCtrl {

    //our User's CRUD

    //GETALLUSERS
    getAllUsers = async (_req: Request, res: Response) => {
        try {
            const users: IUser[] = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //POST CREATEUSER
    createUser = async (req: Request, res: Response) => {

        console.log(req.body);

        try {
            //we create this object to not take user's id
            const newUser: IUser = new User({
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });

            console.log(newUser);
            //this takes some time!
            await newUser.save();
            res.json({
                status: 'User Saved Succesfully'
            });
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //DELETE USER
    deleteUser = async (req: Request, res: Response) => {
        console.log(req.params);
        try {
            const vacio = await User.findByIdAndDelete(req.params.id);
            console.log(vacio);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'No esta este usuario en la base de datos'
                });
            } else {
                res.status(200).json({
                    status: 'User eliminado correctamente'
                });
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //UPDATE USER
    updateUser = async (req: Request, res: Response) => {

        console.log(req.params);

        //we obtain id before we give it
        const { id } = req.params;
        //we want to modify this object with these parameters
        const modifiedUser: IUser = req.body;
        try {
            //if any parameter doesn't exist we create it
            const vacio = await User.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'User no existe'
                });
            } else {
                await User.findByIdAndUpdate(id, { $set: modifiedUser }, { new: true })
                res.status(200).json({
                    status: 'User actualizado correctamente'
                });
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //GET USER
    getUser = async (req: Request, res: Response) => {

        console.log(req.params);
        try {
            const user = await User.findById(req.params.id);
            if (user === null) {
                res.status(400).json({
                    code: 404,
                    status: 'User no existe'
                });

            } else {
                res.json(user);
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //LOGIN OF ONE USER
    logIn = async (req: Request, res: Response) => {

        console.log(req.body);
        const { email, password } = req.body;

        //search the params ({email: email}) ---> next steps encrypt again
        try {
        //we wait to the search in database (async-await)
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({status:"This email doesn't exist!"});
        //& password validator
        const correctPassword: boolean = await user.validatePassword(password);
        if(!correctPassword) return res.status(401).send("Incorrect password!");
        //the token of the user expires in one day ++
        const token: string = jwt.sign({_id: user._id}, process.env.JWT_SECRET || 'tokentest', {
            expiresIn: '24h'
        });
        const _aux = {
            _id: user._id,
            token: token,
            userName: user.userName
        }
        console.log(_aux);
        res.status(200).json(_aux);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //REGISTER USER
    signUp = async (req: Request, res: Response) => {
        //we see the body of the user's request
        console.log(req.body);

        //we extract the info of the json object
        const { email, userName, password } = req.body;

        //in the next steps, we encrypt these params
        try {
        const newSignUpUser: IUser = new User({email, userName, password});
        await newSignUpUser.save();
    
        //then, we create a token (payload, variable & options)
        //the token of the user expires in one day ++
        const token: string = jwt.sign({_id: newSignUpUser._id}, process.env.JWT_SECRET || 'tokentest', {
            expiresIn: '24h'
        });

        //we return the json object with the created token to the user & status = OK
        const _aux = {
            _id: newSignUpUser._id,
            token: token,
            userName: newSignUpUser.userName
        }
        console.log(_aux);
        res.status(200).json(_aux);
        } catch (err) {
            console.log(err.message);
            res.status(409).json({
                status: `${err.message}`
            });
        }
    }

    //send email
    sendEmail = async (req: Request, res: Response) => {
        const {email} = req.body;

        res.send('received');
    }

}

export default new userCtrl();
