import {Router} from "express"; 
import passport from "passport";
import notificationsController from '../controllers/notification.controller';

//Router nos permite gestionar rutas de la API
const notificationsRouter = Router();

notificationsRouter.post('/me', passport.authenticate("jwt", {session: false}), notificationsController.getMyNotifications);
notificationsRouter.post('/del', passport.authenticate("jwt", {session: false}), notificationsController.delNotification);

//create notification
notificationsRouter.post('/add', passport.authenticate("jwt", {session: false}), notificationsController.addNotification);

export default notificationsRouter;
