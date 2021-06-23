import { Router } from 'express';
import lotCtrl from '../controllers/lot.controller';

const lotRouter: Router = Router();



//we put all routes in this file & we will se in the future
lotRouter.get('/', lotCtrl.getAllLotsSorted);
lotRouter.get('/All', lotCtrl.getAllLots);
lotRouter.post('/', lotCtrl.createLot);
lotRouter.delete('/:id', lotCtrl.deleteLot);
lotRouter.put('/:id', lotCtrl.updateLot);
lotRouter.get('/:id', lotCtrl.getLot);
lotRouter.get('/get/:name', lotCtrl.getLotsWithSameName);
lotRouter.get('/getLotsByChart/:id', lotCtrl.getLotsByChart);
lotRouter.get('/gets/getNumAll', lotCtrl.getNumAll);
lotRouter.get('/getSortLotsByAscPrice/:id', lotCtrl.getSortLotsByAscPrice);
lotRouter.get('/getSortLotsByAscQty/:id', lotCtrl.getSortLotsByAscQty);
lotRouter.get('/getByUser/:id', lotCtrl.getLotsByUserId);
lotRouter.get('/getByBusiness/:id', lotCtrl.getLotsByBusinessId);
lotRouter.get('/getByBusinessStoredWithUserID/:id', lotCtrl.getLotsByBusinessIdStored);
lotRouter.get('/getByBusinessStoredTrueWithUserID/:id', lotCtrl.getLotsByBusinessIdStoredTrue);
lotRouter.get('/getByUserStoredTrueWithUserID/:id', lotCtrl.getLotsByUserIdStoredTrue);

export default lotRouter;