import mongoose, { Schema, model } from 'mongoose';
import Lot, {ILot} from './lot';
import User, {IUser} from './user';

export interface IDelivery extends mongoose.Document {
    lotItem: ILot, 
    originLocation: string, //business
    destinationLocation: string, //casa
    destinationItem: IUser, 
    deliveryDate?: string,
    isPicked?: boolean,
    isDelivered?: boolean,
    isReady?: boolean,
    businessItem: IUser,
    isAssigned: boolean,
    userItem?: IUser,
    description?: string,
    time?: string,
    casa?: boolean
}

const deliverySchema = new Schema({
    lotItem: { type: mongoose.Schema.Types.ObjectId, ref: Lot, required: true},
    originLocation: { type: String, required:true},
    destinationLocation: { type: String, required: true},
    destinationItem: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true},
    deliveryDate: { type: String, required: false},
    isPicked: { type: Boolean, required: false, default: false},
    isDelivered: { type: Boolean, required: false, default: false},
    isReady: { type: Boolean, required: false, default: false},
    businessItem: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true},
    isAssigned: { type: Boolean, required: false, default: false},
    userItem: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true},
    description: { type: String, required: false, default: '',
    time: { type: String, required: false, default: ''},
    casa: { type: Boolean, required: false, default: false}}
}, {
    //timestamps adds createDate and updateDate of the object
    timestamps: true,
    versionKey: false

})

//we will export our entity
export default model<IDelivery>('Delivery', deliverySchema);
