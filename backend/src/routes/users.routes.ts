import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import usersCtrl from '../controllers/users.controller';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const usersRouter: Router = Router();

usersRouter.post('/forgotPassword', usersCtrl.forgotPassword);
usersRouter.get('/reset/:resetLink', usersCtrl.reset);
usersRouter.post('/reset/:resetLink', usersCtrl.resetPassword);

usersRouter.get('/getNumByRole/:role', usersCtrl.getNumByRole);
usersRouter.get('/getNumAll', usersCtrl.getNumAll);
usersRouter.get('/getUsersByRole/:role', usersCtrl.getUsersByRole);

//we put all routes in this file & we will se in the future
usersRouter.get('/', usersCtrl.getAllUsers);
usersRouter.post('/', usersCtrl.createUser);
usersRouter.delete('/:id', usersCtrl.deleteUser);
usersRouter.put('/:id', usersCtrl.updateUser);
usersRouter.put('/:id/putfriend', usersCtrl.putFriend);
usersRouter.put('/:id/deletefriend', usersCtrl.deleteFriend);
usersRouter.get('/:id', usersCtrl.getUser);
usersRouter.get('/chat/:id', usersCtrl.getUserChat);

//auth routes ---> we research private routes
usersRouter.post('/logIn', usersCtrl.logIn);
//auth with GOOGLE
usersRouter.post('/logInGoogle', usersCtrl.logInGoogle);
//the signup route has a small difference with the createUser route
usersRouter.post('/signUp', usersCtrl.signUp);

//test passport (Headers-Authorization: Bearer token)
usersRouter.get('/special/checkToken', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.send('works!');
})

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

//we export this router
export default usersRouter;
