import mongoose, { Schema, model } from 'mongoose';
import User, {IUser} from './user';
export interface ILot extends mongoose.Document {
    name: string,
    dimensions: string,
    weight: string,
    qty: string,
    price: string,
    isFragile: boolean,
    info?: string,
    minimumQty: string,
    businessItem: IUser,
    userItem?: IUser,
    stored?: boolean,
    delivered?: boolean,
    picked?: boolean
}

const lotSchema = new Schema({
    name: { type: String, required: true},
    dimensions: { type: String, required: true},
    weight: { type: String, required: true},
    qty: { type: String, required: true},
    price: { type: String, required: true},
    isFragile: { type: Boolean, required: true},
    info: { type: String, required: false, default: ''},
    minimumQty: { type: String, required: true},
    businessItem: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true},
    userItem: { type: mongoose.Schema.Types.ObjectId, ref: User, required: false},
    stored: { type: Boolean, required: false, default: false},
    delivered: { type: Boolean, required: false, default: false},
    picked: { type: Boolean, required: false, default: false}
}, {
    //timestamps adds createDate and updateDate of the object
    timestamps: true,
    versionKey: false

})

//we will export our entity
export default model<ILot>('Lot', lotSchema);