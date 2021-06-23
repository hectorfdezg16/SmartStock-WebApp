import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import adminCtrl from '../controllers/admin.controller';
import jwt from 'jsonwebtoken';

const adminRouter: Router = Router();

//we put all routes in this file & we will se in the future
adminRouter.get('/', adminCtrl.getAllAdmins);
adminRouter.post('/', adminCtrl.createAdmin);
adminRouter.delete('/:id', adminCtrl.deleteAdmin);
adminRouter.put('/:id', adminCtrl.updateAdmin);
adminRouter.get('/:id', adminCtrl.getAdmin);

//auth routes ---> we research private routes
adminRouter.post('/logIn', adminCtrl.logIn);
//the signup route has a small difference with the createUser route
adminRouter.post('/signUp', adminCtrl.signUp);

//validated function to private routes --- verify token -/- express routing
function verifyToken(req: Request, res: Response, next: NextFunction) {

    console.log(req.headers.authorization);

    // if you don't have authorization field ---> you can't access to the route
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized acces!');
    }

    // exemple authorization header field = ['Bearer', 'token...']
    const token = req.headers.authorization.split(' ')[1]
    if(token == 'null'){
        return res.status(401).send('Unauthorized acces!');
    }

    // we need the token of the user and your private key ---> checking...
    const payload = jwt.verify(token, 'secretkey')
    console.log(payload);

    // we save id of the payload on a property

    //LA LINEA DE ABAJO NO ESTA BIENNNNNNN!!!
    req.body._id = payload;
    next();
}

// private routes
//usersRouter.get('/admin/users', verifyToken, usersCtrl.getBackOffice);

//we will export
export default adminRouter;