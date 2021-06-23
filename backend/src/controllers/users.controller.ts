//we require a model from models folder and the interface of this model
import User, { IUser } from '../models/user';
import { Request, Response } from 'express';
//we require the info of the jsonwebtoken module
import jwt from 'jsonwebtoken';
import mailgun from 'mailgun-js';
import _ from 'lodash';
//if we see that JWT_SECRET & RESETJWT_SECRET fail we use also the following structure 
let DOMAIN: string = process.env.DOMAIN!;
let APIKEY: string = process.env.MAILGUN_APIKEY!;
const mg = mailgun({apiKey: APIKEY, domain: DOMAIN});

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
                role: req.body.role,
                bank: req.body.bank,
                location: req.body.location
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
        //we obtain id before we give it
        const { id } = req.params;

        //we want to modify this object with these parameters
        const modifiedUser: IUser = req.body;
        console.log("EL REQBODY");
        console.log(req.body);
        try {
            //if any parameter doesn't exist we create it
            const vacio = await User.findById(id);
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
    
    //DELETE
    deleteFriend = async (req:Request, res: Response)=> {
        try {
            const vacio = await User.findByIdAndUpdate(req.params.id, { $pull: {"friends": req.body.friend }});
            console.log(vacio);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'No esta este usuario en la base de datos'
                });
            } else {
                res.status(200).json({
                    status: 'User actualizado'
                });
            }

        }catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
    //DELETE
    putFriend = async (req:Request, res: Response)=> {
        try {
            const vacio = await User.findByIdAndUpdate(req.params.id, { $push: {"friends": req.body.friend }});
            console.log(vacio);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'No esta este usuario en la base de datos'
                });
            } else {
                res.status(200).json({
                    status: 'User actualizado'
                });
            }
        }catch (err) {
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


    //GET USER CHAT (popula los amigos)
    getUserChat = async (req: Request, res: Response) => {

        console.log(req.params);
        try {
            const user = await User.findById(req.params.id).populate('friends');
            //.populate({ path: 'messages', populate: { path: 'Message' } });
            console.log(user);
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
        const user = await User.findOne({email}).populate('friends');
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
            userName: user.userName,
            role: user.role,
            location: user.location,
            bank: user.bank,
            friends: user.friends
        }
        console.log(_aux);
        res.status(200).json(_aux);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //LOGIN OF ONE USER GOOGLE
    logInGoogle = async (req: Request, res: Response) => {
        console.log(req.body);
        const { email, userName, password, avatar } = req.body;
        //search the params ({email: email}) ---> next steps encrypt again
        try {
            //we wait to the search in database (async-await)
            const user = await User.findOne({ email });
            if (!user) {
                const newSignUpUser: IUser = new User({ email, userName, password, avatar });
                await newSignUpUser.save();
                const user = await User.findOne({ email });
                return res.status(200).json(user);
            }
            else {
                return res.status(200).json(user);
            }
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
        const { email, userName, password} = req.body;

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
    forgotPassword = async (req: Request, res: Response) => {

        //check in the terminal if it's work
        console.log(req.body);
        const {email} = req.body;

        try {
            const user = await User.findOne({email});
            //make sure user exist in db
            if(!user) return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
            //user exist and now create a one token valid for 5 mins
            const token: string = jwt.sign({_id: user._id}, process.env.RESET_JWT_SECRET || 'tokentestreset', {
                expiresIn: '5m'
            });
            let link = "" + process.env.CLIENT_URL + "/api/users/reset/" + token;
            //we send the email to the user
            const mailOptions = {
                to: email,
                from: process.env.FROM_EMAIL || "example@example.com",
                subject: 'Password change request',
                text: `Hi ${user.userName} \n
                Please click on the following link ${link} to reset your password. \n\n
                If you did not request this, please ignore this email and your password will remain unchanged. \n`
            };
            await User.updateOne({_id: user._id},{$set:{resetLink: token}},{new: true});
            mg.messages().send(mailOptions, function(error: any, body:any){
                if(error) return res.status(401).json({error: "some problem"})
                return res.json({message: 'email has been sent, follow the instructions'})
            });
            
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    reset = (req: Request, res: Response) => {

        const resetLink: string = req.params.resetLink;
        //const {newPass, confNewPass} = req.body;

        if(resetLink){
                jwt.verify(resetLink, process.env.RESET_JWT_SECRET || 'tokentestreset', async function(error: any, decodeData: any) {
                    if(error){
                        return res.status(401).json({error: "Incorrect token or has been expired!"})
                    }

                    try{
                        await User.findOne({resetLink}, async (err: any, user: any) =>{
                            if(err || !user){
                                return res.status(401).json({error: "There is no user for this token!"});
                            }
                            res.render('pages/reset', {user});
                        });
                    } catch (err) {
                        console.log(err.message);
                        res.status(500).json({
                            status: `${err.message}`
                        });
                    }
                });
            }
    }

    resetPassword = (req: Request, res: Response) => {

        //check in the terminal if it's work
        //console.log(req.body);
        
        const resetLink: string = req.params.resetLink;
        const {/*resetLink, */newPass, confNewPass} = req.body;

        if(resetLink){
            if(newPass === confNewPass){
                jwt.verify(resetLink, process.env.RESET_JWT_SECRET || 'tokentestreset', async function(error: any, decodeData: any) {
                    if(error){
                        return res.status(401).json({error: "Incorrect token or has been expired!"})
                    }

                    try{
                        await User.findOne({resetLink}, async (err: any, user: any) =>{
                            if(err || !user){
                                return res.status(401).json({error: "There is no user for this token!"});
                            }

                            //res.render('reset', {user});
                            const obj = {
                                password: newPass,
                                resetLink: ''
                            }
        
                            user = _.extend(user,obj);
                            //and we save the user with the new password
                            await user.save((err: any, result: any)=>{
                                if(err) return res.status(500).json({message: err.message});
                                
                                const mailOptions = {
                                    to: user.email,
                                    from: process.env.FROM_EMAIL || "example@example.com",
                                    subject: 'Your password has been changed',
                                    text: `Hi ${user.userName} \n
                                    This is a confirmation that the password for your account ${user.email} has just been changed. \n`
                                };

                                mg.messages().send(mailOptions, function(error: any, body:any){
                                    if(error) return res.status(500).json({message: error.message});
                                    res.status(200).json({message: 'Your password has been updated.'});
                                });

                                // else {
                                //     return res.status(200).json({message: 'Password change succesfully!'});
                                // }
                            })
                        })
                    } catch (err) {
                        console.log(err.message);
                        res.status(500).json({
                            status: `${err.message}`
                        });
                    }
                })
            } else {
                return res.status(401).json({status: "¡No coinciden las contraseñas! Prueba otra vez"});
            }
        } else {
            return res.status(401).json({status:"¡No estás autorizad@ para hacer esto!"});
        }
    }

    //new functions for the test
    getNumByRole = async (req: Request, res: Response) => {
        console.log(req.params);
        try {
            const numByRole: number = await User.find({ "role": req.params.role }).count();
            res.status(200).send(numByRole.toString());
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getNumAll = async (req: Request, res: Response) => {
        try {
            const numAll: number = await User.find().count();
            res.status(200).send(numAll.toString());
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getUsersByRole = async (req: Request, res: Response) => {
        console.log(req.params);
        try {
            //const lot: ILot[] = await Lot.find({ "name": req.params.name })
            const usersByRole: IUser[] = await User.find({ "role": req.params.role });
            //if anything
            //const numAll = await User.find().count();
            res.status(200).send(usersByRole);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    
}

export default new userCtrl();
