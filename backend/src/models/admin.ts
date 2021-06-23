import mongoose, { Schema, model } from 'mongoose';

export interface IAdmin extends mongoose.Document {
    adminName: string,
    email: string,
    password: string,
    //this is a new param of the admin: (1:master & 0:slave) ---> list admins
    role: boolean
    //if we need more params we will add them in a few moments
}

const adminSchema = new Schema({
    adminName: { type: String, unique: true, required: true},
    email: { type: String, lowercase: true, trim: true, unique: true, required: true},
    password: { type: String, required: true},
    role: { type: Boolean, default: false, required: true}
}, {
    //timestamps adds createDate and updateDate of the object
    timestamps: true,
    versionKey: false
});

//we will export our entity
export default model<IAdmin>('Admin', adminSchema);