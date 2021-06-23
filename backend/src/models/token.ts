import mongoose, { Schema, model } from 'mongoose';

export interface IToken extends mongoose.Document {
    userId: string,
    token: string,
    createdAt: Date
}


const tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user"},
    token: { type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: 300} //token expires in 5 minuts
}, {
    //timestamps adds createDate and updateDate of the object
    timestamps: true,
    versionKey: false

})

//we will export our entity
export default model<IToken>('Token', tokenSchema);