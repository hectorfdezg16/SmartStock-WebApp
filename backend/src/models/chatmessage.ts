import { model, Schema } from "mongoose";

export interface IChatMessage extends Document{
    text: String,
    senderID: String,
    receiverID: String;
} 
const ChatSchema = new Schema({
    text: {type: String, required: false},
    senderID:{type: String, required: false},
    receiverID:{type: String, required: false},
})
export default model<IChatMessage>('Message', ChatSchema);
