import { Router } from 'express';
import delivery from 'models/delivery';
import deliveryController from '../controllers/delivery.controller';
import deliveryCtrl from '../controllers/delivery.controller';

const deliveryRouter: Router = Router();

//we put all routes in this file & we will se in the future
deliveryRouter.get('/:id/delivery/lot', deliveryCtrl.getAllDelivery);
deliveryRouter.get('/', deliveryCtrl.getAllDeliveries);
deliveryRouter.post('/', deliveryCtrl.createDelivery);
deliveryRouter.delete('/:id', deliveryCtrl.deleteDelivery);
deliveryRouter.put('/:id', deliveryCtrl.updateDelivery);
deliveryRouter.get('/:id', deliveryCtrl.getDelivery);

deliveryRouter.get('/:id/deliveries', deliveryCtrl.getDeliveries);
deliveryRouter.get('/:id/readydeliveries', deliveryCtrl.getReadyDeliveries);
deliveryRouter.put('/readydelivery/:id', deliveryCtrl.setReadyDelivery);

deliveryRouter.get('/deliverer/notAssigned', deliveryCtrl.getNotAssigned);

deliveryRouter.get('/:id/isAssigned', deliveryCtrl.getAssigned);
deliveryRouter.put('/assigned/:id', deliveryCtrl.setAssigned);
deliveryRouter.get('/getDeliveriesByChart/:id', deliveryCtrl.getDeliveriesByChart);
deliveryRouter.put('/picked/:id', deliveryCtrl.setIsPicked);
deliveryRouter.put('/delivered/:id', deliveryCtrl.setIsDelivered);
deliveryRouter.put('/time/:id', deliveryCtrl.setTime);
deliveryRouter.put('/casa/:id', deliveryCtrl.setCasa);

export default deliveryRouter;