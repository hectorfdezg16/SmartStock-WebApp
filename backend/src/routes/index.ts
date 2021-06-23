import { Router } from 'express';
import usersRouter from './users.routes';
import lotRouter from './lot.routes';
import deliveryRouter from './delivery.routes'
import adminRouter from './admin.routes'
import notificationsRouter from './notification.routes'

const router: Router = Router();

router.use('/users', usersRouter);
router.use('/lots', lotRouter);
router.use('/delivery', deliveryRouter);
router.use('/notifications', notificationsRouter);

//let's talk more about this API --->
router.use('/admins', adminRouter);


/* lo exportamos para poder reutilizar esta pieza de código */
export default router;