import Lot, { ILot } from '../models/lot';
import { Request, Response } from 'express';
import User, { IUser } from '../models/user';

class lotCtrl {
    //CRUD

    getAllLots = async (_req: Request, res: Response) => {
        try {
            const lots: ILot[] = await Lot.find()
            .populate('businessItem')
            .populate('userItem');
            res.json(lots);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }


    //get all lots Sorted without User asociated
    getAllLotsSorted = async (_req: Request, res: Response) => {
        try {
            const lots: ILot[] = await Lot.find({ 'userItem': {$exists: false}, 'stored': false}).sort({name:1})
                .populate('businessItem');
            console.log(lots);
            res.json(lots);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }


    createLot = async (req: Request, res: Response) => {

        console.log(req.body);
        try {
        //we create this object to not take lot's id
        const newLot: ILot = new Lot({
            name: req.body.name,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            qty: req.body.qty,
            price: req.body.price,
            isFragile: req.body.isFragile,
            minimumQty: req.body.minimumQty,
            businessItem: req.body.businessItem,
            userItem: req.body.userItem,
            info: req.body.info,
            stored: req.body.stored,
            delivered: req.body.delivered,
            picked: req.body.picked

            });
            console.log(newLot);

            //this takes some time!
            await newLot.save();
                res.json({
                    status: 'Lot Saved Succesfully'
                });
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    deleteLot = async (req: Request, res: Response) => {
    
        try {
            const vacio = await Lot.findByIdAndDelete(req.params.id);
            console.log(vacio);
            if(vacio === null){
                res.status(400).json({
                    code: 404,
                    status: 'No esta en la base de datos'
                });
            } else {
                res.status(200).json({
                    status: 'Lot eliminado correctamente'
                });
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    updateLot = async (req: Request, res: Response) => {

        console.log(req.params);
        //we obtain id before we give it
        const { id } = req.params;
        //we want to modify this object with these parameters
        const modifiedLot: ILot = req.body;
        try {
        //if any parameter doesn't exist we create it
            const vacio = await Lot.findById(req.params.id);

            if(vacio === null){
                res.status(400).json({
                    code: 404,
                    status: 'Lot no existe'
                });
            }
            else {
                await Lot.findByIdAndUpdate(id, { $set: modifiedLot }, {new: true})
                res.status(200).json({
                    status: 'Lot actualizado correctamente'
                });
            }
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getLot = async (req: Request, res: Response) => {
        console.log(req.params);
        try {
            const lot = await Lot.findById(req.params.id)
            .populate('businessItem')
            .populate('userItem');
            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getLotsWithSameName = async (req: Request, res: Response) => {
        console.log(req.params);
        try {
            const lot: ILot[] = await Lot.find({ "name": req.params.name })
            .populate('businessItem')
            .populate('userItem');
            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }
    
    getLotsByUserId = async (req: Request, res: Response) => {
        try {
            const lot: ILot[] = await Lot.find({ "userItem": Object(req.params.id) }).sort({ name:1 })
            .populate('businessItem')
            .populate('userItem');
            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getLotsByChart = async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const lot: ILot[] = await Lot.find({ "userItem": Object(req.params.id) });
            var data = [];
            for(var i in lot){
                let modelData = {
                    name: lot[i].name,
                    money: parseInt(lot[i].qty)*parseInt(lot[i].price)*0.2
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

    getLotsByBusinessId = async (req: Request, res: Response) => {
        try {
            const lot: ILot[] = await Lot.find({ "businessItem": Object(req.params.id) }).sort({ name: 1 })
                .populate('businessItem')
                .populate('userItem');
            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    //new functions for the test
    // getNumLotsByUserId = async (req: Request, res: Response) => {
    //     console.log(req.params);
    //     try {
    //         const numByRole: number = await Lot.find({ "userItem": req.params.id }).count();
    //         res.status(200).send(numByRole);
    //     } catch (err) {
    //         res.status(500).json({
    //             status: `${err.message}`
    //         });
    //     }
    // }

    getNumAll = async (req: Request, res: Response) => {
        try {
            const numAll: number = await Lot.find().count();
            res.status(200).send(numAll.toString());
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getSortLotsByAscPrice = async (req: Request, res: Response) => {
        try {
            const lot: ILot[] = await Lot.find({"userItem":Object(req.params.id)})
            .populate('businessItem')
            .populate('userItem');
            lot.sort((a: any, b: any) => {
                return a.price - b.price;
            });
            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getSortLotsByAscQty = async (req: Request, res: Response) => {
        try {
            const lot: ILot[] = await Lot.find({"userItem":Object(req.params.id)})
            .populate('businessItem')
            .populate('userItem');
            lot.sort((a: any, b: any) => {
                return a.qty - b.qty;
            });
            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getLotsByBusinessIdStored = async (req: Request, res: Response) => {
        try {
            const lot: ILot[] = await Lot.find(
                { 
                    $and: [
                        { "businessItem": Object(req.params.id) }, { "userItem": { $exists: true } }, { "stored": false}
                    ]
                }
            ).sort({ name: 1 })
                .populate('businessItem')
                .populate('userItem');
                
            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getLotsByBusinessIdStoredTrue = async (req: Request, res: Response) => {
        try {
            const lot: ILot[] = await Lot.find(
                {
                    $and: [
                        { "businessItem": Object(req.params.id) }, { "userItem": { $exists: true } }, { "stored": true }
                    ]
                }
            ).sort({ name: 1 })
                .populate('businessItem')
                .populate('userItem');

            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }

    getLotsByUserIdStoredTrue = async (req: Request, res: Response) => {
        try {
            const lot: ILot[] = await Lot.find(
                {
                    $and: [
                        { "userItem": Object(req.params.id) }, { "stored": true }
                    ]
                }
            ).sort({ name: 1 })
                .populate('businessItem')
                .populate('userItem');

            res.json(lot);
        } catch (err) {
            res.status(500).json({
                status: `${err.message}`
            });
        }
    }


}

export default new lotCtrl();