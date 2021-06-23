//we require a model from models folder and the interface of this model
import Admin, { IAdmin } from '../models/admin';
import { Request, Response } from 'express'

//we don't need the imports of the API User

//we require the info of the jsonwebtoken module (also for Admin)
import jwt from 'jsonwebtoken';

//Basic CRUD of Admin (it's the same as the user model)
class adminCtrl {

    getAllAdmins = async (_req: Request, res: Response) => {
        try {
            const admins: IAdmin[] = await Admin.find();
            res.json(admins);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    createAdmin = async (req: Request, res: Response) => {

        console.log(req.body);

        try {

        //we create this object to not take user's id
            const newAdmin: IAdmin = new Admin({
                adminName: req.body.adminName,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });
            console.log(newAdmin);

            //this takes some time!
            await newAdmin.save();
            res.json({
                status: 'Admin Saved Succesfully'
            });
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    deleteAdmin = async (req: Request, res: Response) => {
    
        console.log(req.params);
        try {
            const empty = await Admin.findByIdAndDelete(req.params.id);
            console.log(empty);
            if(empty === null){
                res.status(400).json({
                    code: 404,
                    status: 'It can not be found this admin on the API!'
                });
            } else {
                res.status(200).json({
                    status: 'Admin successfully deleted!'
                });
            }

        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    updateAdmin = async (req: Request, res: Response) => {

        console.log(req.params);

        //we obtain id before we give it
        const { id } = req.params;

        //we want to modify this object with these parameters
        const modifiedAdmin: IAdmin = req.body;

        try {

            //if any parameter doesn't exist we create it
            const empty = await Admin.findById(req.params.id);
            if (empty === null) {
                res.status(400).json({
                    code: 404,
                    status: 'This admin does not exist'
                });
            } else {
                await Admin.findByIdAndUpdate(id, { $set: modifiedAdmin }, { new: true })
                res.status(200).json({
                    status: 'Admin successfully deleted!'
                });
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getAdmin = async (req: Request, res: Response) => {

        console.log(req.params);
        try {
            const admin = await Admin.findById(req.params.id);
            if (admin === null) {
                res.status(400).json({
                    code: 404,
                    status: 'This admin does not exist'
                });

            } else {
                res.json(admin);
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    logIn = async (req: Request, res: Response) => {

        console.log(req.body);
        const { email, password} = req.body;

        //search the params ({email: email}) ---> next steps encrypt again
        try {

            //we wait to the search in database (async-await)
            const admin = await Admin.findOne({email});
            if(!admin) return res.status(401).send("This email doesn't exist!");
            
            //& password validator
            else if(admin.password !== password) return res.status(401).send("Incorrect password!");
            const token = jwt.sign({_id: admin._id}, 'secretkey');
            const _aux = {
                _id: admin._id,
                token: token
            }

        res.status(200).json(_aux);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    signUp = async (req: Request, res: Response) => {

        //we see the body of the admin's request
        console.log(req.body);

        //we extract the info of the json object
        //at the moment, the role isn't used! will see..
        const { email, adminName, password, role} = req.body;

        //in the next steps, we encrypt these params
        try {
            const newSignUpAdmin: IAdmin = new Admin({email, adminName, password, role});
            await newSignUpAdmin.save();
        
            //then, we create a token (payload, variable & options)
            const token = jwt.sign({_id: newSignUpAdmin._id}, 'secretkey');

            //we return the json object with the created token to the user & status = OK
            const _aux = {
                _id: newSignUpAdmin._id,
                token: token
            }
            console.log(_aux);
            res.status(200).json({_aux})
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    /*getBackOffice = async (req: Request, res: Response)=>{
        res.status(200).send('All OK!');
    }*/

}

export default new adminCtrl();