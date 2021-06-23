import Delivery, { IDelivery } from '../models/delivery';
import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import user from '../models/user';
import Lot, { ILot } from '../models/lot';



class deliveryCtrl {

    getAllDelivery = async (_req: Request, res: Response) => {
        console.log("llega");
        try {
            const deliveryyy: IDelivery | null = await Delivery.findOne({ "lotItem": Object(_req.params.id) });
            console.log(deliveryyy);
            res.json(deliveryyy?._id);

        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }


    getAllDeliveries = async (_req: Request, res: Response) => {
        console.log("llega");

        console.log(_req.body);
        try {
            const deliveries: IDelivery[] = await Delivery.find()
                .populate({ path: 'lotItem', populate: { path: 'userItem' } })
                .populate({ path: 'lotItem', populate: { path: 'businessItem' } })
                .populate('destinationItem')
                .populate('businessItem')
                .populate('userItem');

            console.log(deliveries);
            res.json(deliveries);

        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //GET NOT REDAY DELIVERIES USER





    getDeliveries = async (req: Request, res: Response) => {
        console.log("no llega");
        const vacio = await User.findById(req.params.id)
        if (vacio === null) {
            console.log(req.body);
            res.status(400).json({
                code: 404,
                status: 'Delivery no existe'
            });
        }
        try {
            const deliveries: IDelivery[] = await Delivery.find({ "userItem": Object(req.params.id), "isReady": false, "casa": true })
                .populate({ path: 'lotItem', populate: { path: 'userItem' } })
                .populate({ path: 'lotItem', populate: { path: 'businessItem' } })
                .populate('destinationItem')
                .populate('businessItem')
                .populate('userItem');

            console.log(deliveries);
            res.json(deliveries);

        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
    getReadyDeliveries = async (req: Request, res: Response) => {
        console.log(req.body);
        try {
            const deliveries: IDelivery[] = await Delivery.find({ "userItem": Object(req.params.id), "isReady": true, "isDelivered": false, "casa": false })
                .populate({ path: 'lotItem', populate: { path: 'userItem' } })
                .populate({ path: 'lotItem', populate: { path: 'businessItem' } })
                .populate('destinationItem')
                .populate('businessItem')
                .populate('userItem');

            console.log(deliveries);
            res.json(deliveries);

        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    setReadyDelivery = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const vacio = await Delivery.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                await Delivery.findByIdAndUpdate(req.params.id, { $set: { "isReady": true } })
                res.status(200).json({

                    status: 'Delivery actualizado correctamente'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //get not assigned deliveries for deliverer
    getNotAssigned = async (req: Request, res: Response) => {
        try {
            const deliveries: IDelivery[] = await Delivery.find({ "isAssigned": false, "isReady": true })
                .populate({ path: 'lotItem', populate: { path: 'userItem' } })
                .populate({ path: 'lotItem', populate: { path: 'businessItem' } })
                .populate('destinationItem')
                .populate('businessItem')
                .populate('userItem');

            console.log(deliveries);
            res.json(deliveries);

        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
    //get assigned deliveries of the deliverer
    getAssigned = async (req: Request, res: Response) => {
        try {
            const vacio = await User.findById(req.params.id)
            if (vacio === null) {
                console.log(req.body);
                res.status(400).json({
                    code: 404,
                    status: 'User no existe?'
                });
            }
            const deliveries: IDelivery[] = await Delivery.find({ "userItem": Object(req.params.id), "isAssigned": true, "isDelivered": false })
                .populate({ path: 'lotItem', populate: { path: 'userItem' } })
                .populate({ path: 'lotItem', populate: { path: 'businessItem' } })
                .populate('destinationItem')
                .populate('businessItem')
                .populate('userItem');

            console.log(deliveries);
            res.json(deliveries);

        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
    //set is assigned delivery for deliverer
    setAssigned = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const vacio = await Delivery.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                await Delivery.findByIdAndUpdate(req.params.id, { $set: { "userItem": Object(req.body.id), "isAssigned": true } })
                res.status(200).json({

                    status: 'Delivery actualizado correctamente'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
    //set is picked delivery for deliverer
    setIsPicked = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const vacio = await Delivery.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                await Delivery.findByIdAndUpdate(req.params.id, { "isPicked": true })
                res.status(200).json({
                    status: 'Delivery actualizado correctamente'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
    //set is delivered
    setIsDelivered = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const vacio = await Delivery.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                await Delivery.findByIdAndUpdate(req.params.id, { "isDelivered": true })
                res.status(200).json({
                    status: 'Delivery actualizado correctamente'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    setTime = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const vacio = await Delivery.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                await Delivery.findByIdAndUpdate(req.params.id, { "time": req.body.time })
                res.status(200).json({
                    status: 'Delivery actualizado correctamente'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    setCasa = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const vacio = await Delivery.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                await Delivery.findByIdAndUpdate(req.params.id, { "casa": true })
                res.status(200).json({
                    status: 'Delivery actualizado correctamente'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }


    //POST CREATEONE
    createDelivery = async (req: Request, res: Response) => {
        /* console.log(req.body) */
        try {
            //we create this object to not take delivery's id
            const user: IUser | null = await User.findById(req.body.userItem);

            const lot: ILot | null = await Lot.findById(req.body.lotItem)
                .populate('businessItem')
                .populate('userItem');

            /* console.log(lot + 'lo tengo');
            console.log(lot + 'lo tengo');
            console.log(lot + 'lo tengo'); */

            //QUiero saber si tengo la id de businessItem en: lot.businessItem
            console.log('lo tengo::::' + lot?.businessItem + 'lo tengo');
            console.log('lo tengo::::' + lot + 'lo tengo');

            const business: IUser | null = await User.findById(lot?.businessItem._id);

            const newDelivery: IDelivery = new Delivery({
                lotItem: lot,
                originLocation: business?.location,
                destinationLocation: user?.location,
                destinationItem: user,
                deliveryDate: req.body.deliveryDate,
                isPicked: req.body.isPicked,
                isDelivered: req.body.isDelivered,
                isReady: req.body.isReady,
                businessItem: business,
                isAssigned: req.body.isAssigned,
                userItem: user,
                description: lot?.info,
                casa: req.body.casa
            });
            console.log('Info del newDelivery::::::' + newDelivery);
            //this takes some time!
            await newDelivery.save();
            res.status(200).json(newDelivery);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //DELETEONE
    deleteDelivery = async (req: Request, res: Response) => {

        console.log(req.params);

        try {
            const vacio = await Delivery.findByIdAndDelete(req.params.id)
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                res.status(200).json({
                    status: 'Delivery eliminado correctamente'
                });
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //PUT MODIFYONE
    updateDelivery = async (req: Request, res: Response) => {
        // For update the delivery params:
        //Location
        //Booleans
        console.log(req.params);

        //we obtain id before we give it
        const { id } = req.params;
        //we want to modify this object with these parameters
        const modifiedDelivery: IDelivery = req.body;
        try {
            //if any parameter doesn't exist we create it
            const vacio = await Delivery.findById(req.params.id);
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Delivery no existe'
                });
            } else {
                await Delivery.findByIdAndUpdate(id, { $set: modifiedDelivery }, { new: true })
                res.status(200).json({
                    status: 'Delivery actualizado correctamente'
                });
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //GETONE
    getDelivery = async (req: Request, res: Response) => {
        console.log(req.params);
        try {
            const delivery = await Delivery.findById(req.params.id)
                .populate('lotItem')
                .populate('destinationItem', { 'userName': 1, 'email': 1, 'location': 1, 'role': 1 })
                .populate('businessItem', { 'userName': 1, 'email': 1, 'location': 1, 'role': 1 })
                .populate('userItem', { 'userName': 1, 'email': 1, 'location': 1, 'role': 1 });
            res.json(delivery);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getDeliveriesByChart = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const delivery: IDelivery[] = await Delivery.find({ "userItem": Object(req.params.id) });
            var data = [];
            var numDel: number;
            var obj: number;
            for (obj = 1; obj < 13; obj++) {
                numDel = 0;
                for (var i in delivery) {
                    var date: string = delivery[i].deliveryDate!;
                    var month: string = date.slice(3, -5);
                    if (month.charAt(0) == "0") month.slice(1, 0);
                    if (month == obj.toString()) numDel++;
                }
                let modelData = {
                    month: obj,
                    orders: numDel
                };
                data.push(modelData);
            }
            res.json(data);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
}

export default new deliveryCtrl();
